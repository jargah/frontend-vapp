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
        return { status: r.status, success: false, errors: r.errors, };
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
};
