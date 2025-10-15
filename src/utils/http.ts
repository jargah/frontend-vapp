import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
export type HeadersMap = Record<string, string>;

export interface QueryParams {
    [key: string]: string | number | boolean | null | undefined;
}

export interface ServerEnvelope<T = unknown> {
    status: number;
    data?: T | null;
    errors?: unknown;
}

export type ClientResponse<T = unknown> =
    | { status: number, success: true; data: T }
    | { status: number, success: false; data?: null; errors?: unknown; error?: Array<{ code: number; message: string }> };

const BASE_URL = import.meta.env.VITE_API_URL as string | undefined;
const ENV_BEARER = import.meta.env.VITE_BEARER as string | undefined;
const ENV_REFERENCE = import.meta.env.VITE_REFERENCE as string | undefined;

if (!BASE_URL) {
    throw new Error('VITE_API_URL no está definido.');
}

let runtimeBearer: string | undefined = ENV_BEARER;

let defaultHeaders: HeadersMap = {};

export function setAuthToken(token?: string) {
    runtimeBearer = token;
}

export function setDefaultHeaders(headers: HeadersMap | ((prev: HeadersMap) => HeadersMap)) {
    defaultHeaders = typeof headers === 'function' ? headers(defaultHeaders) : { ...headers };
}

export function addDefaultHeader(name: string, value: string) {
    defaultHeaders = { ...defaultHeaders, [name]: value };
}

export function removeDefaultHeader(name: string) {
    const copy = { ...defaultHeaders };
    delete copy[name];
    defaultHeaders = copy;
}

export function clearDefaultHeaders() {
    defaultHeaders = {};
}

function isFormLike(data: unknown): boolean {
    return (
        (typeof FormData !== 'undefined' && data instanceof FormData) ||
        (typeof Blob !== 'undefined' && data instanceof Blob) ||
        (typeof File !== 'undefined' && data instanceof File)
    );
}

function createAxios(): AxiosInstance {
    const instance = axios.create({
        baseURL: BASE_URL,
        timeout: 15000,
        headers: { Accept: 'application/json' },
        transformRequest: [
            (data, headers) => {
                if (isFormLike(data)) {
                    if (headers) {
                        delete (headers as any)['Content-Type'];
                        delete (headers as any)['content-type'];
                    }
                    return data as any;
                }
                if (data === undefined || data === null) return data as any;
                if (headers) {
                    (headers as any)['Content-Type'] = 'application/json';
                }
                return JSON.stringify(data);
            },
            ...(axios.defaults.transformRequest as any[]),
        ],
    });

    instance.interceptors.request.use((config) => {
        const h = (config.headers = (config.headers ?? {}) as any);

        if (!h.Authorization && !h.authorization) {
            const token = runtimeBearer ?? ENV_BEARER;
            if (token) h.Authorization = `Bearer ${token}`;
        }

        if (!h.reference && ENV_REFERENCE) {
            h.reference = ENV_REFERENCE;
        }

        for (const [k, v] of Object.entries(defaultHeaders)) {
            if (!(k in h) && !(k.toLowerCase() in h)) {
                h[k] = v;
            }
        }

        return config;
    });

    return instance;
}

const api: AxiosInstance = createAxios();

function mapEnvelope<T>(env: ServerEnvelope<T> | null): ClientResponse<T> | null {
    const r = env;

    if (r && r.status === 200 && r.data != null) {
        return { status: r.status, success: true, data: r.data as T };
    } else if (r && (r.status === 400 || r.status === 202)) {
        return { status: r.status, success: false, errors: r.errors };
    } else if (r && r.status === 404) {
        return { status: r.status, success: false, error: [{ code: 404, message: 'Url not found' }] };
    } else if (r && r.status === 401 && r.errors != null) {
        return { status: r.status, success: false, errors: r.errors };
    } else if (typeof r === 'string') {
        return { status: 200, success: true, data: r as T };
    } else {
        return { status: 500, success: false, data: null };
    }
}

export async function apiRequest<T = unknown>(
    method: HttpMethod,
    path: string,
    {
        params,
        data,
        headers,
        config,
    }: {
        params?: QueryParams;
        data?: unknown;
        headers?: HeadersMap;
        config?: AxiosRequestConfig;
    } = {}
): Promise<ClientResponse<T>> {
    try {
        const res = await api.request<ServerEnvelope<T>>({
            url: path,
            method,
            params,
            data,
            headers,
            ...(config || {}),
        });

        console.log(res.data);

        const env: ServerEnvelope<T> | null = res?.data ?? null;
        return mapEnvelope<T>(env)!;
    } catch (err) {
        const ax = err as AxiosError<ServerEnvelope<T>>;
        const env = ax.response?.data ?? null;
        const errors = ax.response?.data?.errors;
        if (env) return mapEnvelope<T>(env)!;
        return { status: 500, success: false, data: null, errors };
    }
}

export const getJson = <T = unknown>(path: string, params?: QueryParams, cfg?: AxiosRequestConfig) =>
    apiRequest<T>('GET', path, { params, config: cfg });

export const delJson = <T = unknown>(path: string, params?: QueryParams, cfg?: AxiosRequestConfig) =>
    apiRequest<T>('DELETE', path, { params, config: cfg });

export const postJson = <T = unknown, B = unknown>(path: string, body: B, params?: QueryParams, cfg?: AxiosRequestConfig) =>
    apiRequest<T>('POST', path, { data: body, params, config: cfg });

export const putJson = <T = unknown, B = unknown>(path: string, body: B, params?: QueryParams, cfg?: AxiosRequestConfig) =>
    apiRequest<T>('PUT', path, { data: body, params, config: cfg });

export const patchJson = <T = unknown, B = unknown>(path: string, body: B, params?: QueryParams, cfg?: AxiosRequestConfig) =>
    apiRequest<T>('PATCH', path, { data: body, params, config: cfg });

export const postForm = <T = unknown>(path: string, form: FormData | Blob | File, params?: QueryParams, cfg?: AxiosRequestConfig) =>
    apiRequest<T>('POST', path, { data: form, params, config: cfg });

export const putForm = <T = unknown>(path: string, form: FormData | Blob | File, params?: QueryParams, cfg?: AxiosRequestConfig) =>
    apiRequest<T>('PUT', path, { data: form, params, config: cfg });

export const patchForm = <T = unknown>(path: string, form: FormData | Blob | File, params?: QueryParams, cfg?: AxiosRequestConfig) =>
    apiRequest<T>('PATCH', path, { data: form, params, config: cfg });

/* =========================
   Descarga de archivos (Excel/CSV/PDF) + manejo de JSON de error
   ========================= */

// Extrae filename del Content-Disposition (soporta filename* UTF-8)
function parseFilenameFromDisposition(header?: string | null, fallback = 'download.bin'): string {
    if (!header) return fallback;

    const star = /filename\*\s*=\s*UTF-8''([^;]+)/i.exec(header);
    if (star && star[1]) {
        try { return decodeURIComponent(star[1].replace(/["]/g, '')); }
        catch { return star[1].replace(/["]/g, '') || fallback; }
    }

    const normal = /filename\s*=\s*"?([^";]+)"?/i.exec(header);
    if (normal && normal[1]) return normal[1].replace(/["]/g, '');
    return fallback;
}

// Intenta leer un Blob como JSON de manera segura
async function readBlobAsJsonSafe<T = any>(blob: Blob): Promise<T | null> {
    try {
        // Heurística rápida por content-type
        const isLikelyJson =
            (blob.type && blob.type.includes('application/json')) ||
            blob.type === '' /* algunos backends no setean type */;
        if (!isLikelyJson) return null;

        const text = await blob.text();
        if (!text) return null;

        // Evita parsear binarios "raros"
        const firstChar = text.trim().charAt(0);
        if (!['{', '[', '"'].includes(firstChar)) return null;

        return JSON.parse(text) as T;
    } catch {
        return null;
    }
}

/**
 * Devuelve el Blob del archivo sin forzar descarga; te da filename y header.
 * Úsalo si quieres manejar el blob manualmente (File System Access API, etc.)
 */
export async function getFileBlob(
    path: string,
    {
        method = 'GET',
        params,
        headers,
        config,
        fallbackFilename = 'download.bin',
        withCredentials = false,
    }: {
        method?: HttpMethod,
        params?: QueryParams,
        headers?: HeadersMap,
        config?: AxiosRequestConfig,
        fallbackFilename?: string,
        withCredentials?: boolean,
    } = {}
): Promise<{ blob: Blob; filename: string; disposition?: string | null }> {
    const res = await api.request<Blob>({
        url: path,
        method,
        params,
        headers: {
            Accept:
                'application/octet-stream, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv, application/pdf, */*',
            ...(headers || {}),
        },
        responseType: 'blob',
        transformRequest: (d) => d, // no tocar JSON aquí
        withCredentials,
        ...(config || {}),
    });

    const disp = (res.headers['content-disposition'] as string | undefined) ?? null;
    const filename = parseFilenameFromDisposition(disp, fallbackFilename);
    return { blob: res.data, filename, disposition: disp };
}

/**
 * Descarga directa en el navegador creando un link temporal.
 */
export async function downloadFile(
    path: string,
    opts?: Parameters<typeof getFileBlob>[1]
): Promise<void> {
    const { blob, filename } = await getFileBlob(path, opts);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || (opts?.fallbackFilename ?? 'download.bin');
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

/**
 * Intenta obtener un archivo; si el backend devuelve JSON de error (aun pidiendo blob),
 * lo parsea y lo mapea con tu mapEnvelope para un flujo controlado.
 *
 * Retorna:
 *  - { ok: true, filename, blob } si es archivo válido
 *  - { ok: false, response } si el backend devolvió un JSON envelope de error
 */
export async function getFileOrEnvelope<T = unknown>(
    path: string,
    {
        method = 'GET',
        params,
        headers,
        config,
        fallbackFilename = 'download.bin',
        withCredentials = false,
    }: {
        method?: HttpMethod,
        params?: QueryParams,
        headers?: HeadersMap,
        config?: AxiosRequestConfig,
        fallbackFilename?: string,
        withCredentials?: boolean,
    } = {}
): Promise<
    | { ok: true; filename: string; blob: Blob }
    | { ok: false; response: ClientResponse<T> }
> {
    try {
        const res = await api.request<Blob>({
            url: path,
            method,
            params,
            headers: {
                Accept:
                    'application/octet-stream, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv, application/pdf, */*',
                ...(headers || {}),
            },
            responseType: 'blob',
            transformRequest: (d, h) => {
                // Si mandas JSON explícitamente, respeta content-type:
                if (h && (h['Content-Type'] || h['content-type'])) return JSON.stringify(d);
                return d;
            },
            withCredentials,
            ...(config || {}),
        });

        // ¿Pareciera JSON?
        const maybeJson = await readBlobAsJsonSafe<ServerEnvelope<T>>(res.data);
        if (maybeJson && typeof maybeJson.status === 'number') {
            const mapped = mapEnvelope<T>(maybeJson)!;
            return { ok: false, response: mapped };
        }

        const disp = (res.headers['content-disposition'] as string | undefined) ?? null;
        const filename = parseFilenameFromDisposition(disp, fallbackFilename);
        return { ok: true, filename, blob: res.data };
    } catch (err) {
        const ax = err as AxiosError<ServerEnvelope<T>>;
        const blob = ax.response?.data as unknown as Blob | undefined;

        // Si vino blob, quizá sea JSON de error
        if (blob instanceof Blob) {
            const maybeJson = await readBlobAsJsonSafe<ServerEnvelope<T>>(blob);
            if (maybeJson) {
                return { ok: false, response: mapEnvelope<T>(maybeJson)! };
            }
        }

        const env = ax.response?.data ?? null;
        if (env && typeof (env as any).status === 'number') {
            return { ok: false, response: mapEnvelope<T>(env as ServerEnvelope<T>)! };
        }

        // Fallback genérico
        return {
            ok: false,
            response: { status: 500, success: false, data: null, errors: ax.message },
        };
    }
}

export default {
    api,
    setAuthToken,
    setDefaultHeaders,
    addDefaultHeader,
    removeDefaultHeader,
    clearDefaultHeaders,
    apiRequest,
    getJson,
    delJson,
    postJson,
    putJson,
    patchJson,
    postForm,
    putForm,
    patchForm,
    // nuevos helpers:
    getFileBlob,
    downloadFile,
    getFileOrEnvelope,
};
