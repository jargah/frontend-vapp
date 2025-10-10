import {
    toast,
    Slide,
    type Id,
    type ToastOptions,
    type ToastContainerOptions,
    type UpdateOptions,
} from 'vue3-toastify'

const DEFAULT_TOAST_OPTS: ToastOptions = {
    position: 'top-right',
    autoClose: 3500,
    closeOnClick: true,
    pauseOnHover: true,
    pauseOnFocusLoss: true,
    hideProgressBar: false,
    theme: 'dark',
    transition: Slide,
}

export const DEFAULT_CONTAINER_OPTS: ToastContainerOptions = {
    limit: 5,
    newestOnTop: true,
}

function normalizeErrorMessage(err: unknown, fallback = 'Ocurrió un error'): string {
    if (typeof err === 'string') return err
    if (err instanceof Error) return err.message || fallback
    const anyErr = err as any
    return (
        anyErr?.response?.data?.message ??
        anyErr?.response?.data?.error ??
        anyErr?.message ??
        fallback
    )
}

export function useToastify(globalDefaults: ToastOptions = {}) {
    const base: ToastOptions = { ...DEFAULT_TOAST_OPTS, ...globalDefaults }

    // básicos
    const show = (message: string, opts?: ToastOptions) => toast(message, { ...base, ...opts })
    const success = (message: string, opts?: ToastOptions) => toast.success(message, { ...base, ...opts, ...{ type: 'success' } })
    const info = (message: string, opts?: ToastOptions) => toast.info(message, { ...base, ...opts, ...{ type: 'info' } })
    const warn = (message: string, opts?: ToastOptions) => toast.warn(message, { ...base, ...opts, ...{ type: 'warning' } })
    const error = (message: string | unknown, opts?: ToastOptions) =>
        toast.error(typeof message === 'string' ? message : normalizeErrorMessage(message), { ...base, ...opts, ...{ type: 'error' } })

    const loading = (message = 'Cargando…', opts?: ToastOptions): Id =>
        toast.loading(message, { ...base, ...opts })

    const update = (id: Id, message: string, opts?: UpdateOptions) =>
        toast.update(id, { render: message, ...opts })

    const close = (id?: Id) => (id ? toast.remove(id) : toast.remove())

    const promise = async <T>(
        p: Promise<T>,
        msgs: {
            pending?: string
            success?: string
            error?: string | ((e: unknown) => string)
        },
        opts?: {
            pending?: ToastOptions
            resolve?: UpdateOptions
            reject?: UpdateOptions
        }
    ): Promise<T> => {
        const id = loading(msgs.pending ?? 'Procesando…', { ...opts?.pending })

        try {
            const result = await p
            update(id, msgs.success ?? 'Completado', {
                type: 'success',
                isLoading: false,
                autoClose: 2500,
                ...opts?.resolve,
            })
            return result
        } catch (e) {
            const errMsg = typeof msgs.error === 'function'
                ? msgs.error(e)
                : (msgs.error ?? normalizeErrorMessage(e))
            update(id, errMsg, {
                type: 'error',
                isLoading: false,
                autoClose: 4000,
                ...opts?.reject,
            })
            throw e
        }
    }

    const apiError = (err: unknown, friendly?: string, opts?: ToastOptions) =>
        error(friendly ?? normalizeErrorMessage(err), opts)

    return {
        DEFAULT_CONTAINER_OPTS,
        show,
        success,
        info,
        warn,
        error,
        loading,
        update,
        close,
        promise,
        apiError,
    }
}
