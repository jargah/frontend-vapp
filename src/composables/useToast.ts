import { reactive } from "vue";

type ToastLocation =
    | "top"
    | "bottom"
    | "start"
    | "end"
    | "top start"
    | "top end"
    | "bottom start"
    | "bottom end";

export interface ToastOptions {
    message: string;
    color?: string;
    icon?: string;
    timeout?: number;
    location?: ToastLocation;
    actionText?: string;
    onAction?: () => void;
    closable?: boolean;
}

interface ToastItem extends Required<Pick<ToastOptions, "message">> {
    id: number;
    color?: string;
    icon?: string;
    timeout: number;
    location: ToastLocation;
    actionText?: string;
    onAction?: () => void;
    closable: boolean;
    open: boolean;
}

let _id = 1;

const state = reactive({
    toasts: [] as ToastItem[],
});

function push(options: ToastOptions) {
    const item: ToastItem = {
        id: _id++,
        message: options.message,
        color: options.color,
        icon: options.icon,
        timeout: options.timeout ?? 3500,
        location: options.location ?? "bottom end",
        actionText: options.actionText,
        onAction: options.onAction,
        closable: options.closable ?? true,
        open: true,
    };
    state.toasts.push(item);
    return item.id;
}

function close(id: number) {
    const i = state.toasts.findIndex(t => t.id === id);
    if (i !== -1) state.toasts.splice(i, 1);
}

function closeAll() {
    state.toasts.splice(0);
}

function success(message: string, opts: Omit<ToastOptions, "message"> = {}) {
    return push({ message, color: "success", icon: "mdi-check-circle", ...opts });
}
function info(message: string, opts: Omit<ToastOptions, "message"> = {}) {
    return push({ message, color: "info", icon: "mdi-information", ...opts });
}
function warning(message: string, opts: Omit<ToastOptions, "message"> = {}) {
    return push({ message, color: "warning", icon: "mdi-alert", ...opts });
}
function error(message: string, opts: Omit<ToastOptions, "message"> = {}) {
    return push({ message, color: "error", icon: "mdi-alert-circle", ...opts });
}

export function useToast() {
    return {
        toasts: state.toasts,
        show: push,
        success,
        info,
        warning,
        error,
        close,
        closeAll,
    };
}
