import { reactive } from "vue";

type DialogKind = "alert" | "confirm" | "prompt";
type DialogVariant = "default" | "success" | "info" | "warning" | "error";

const VARIANT_MAP: Record<
    DialogVariant,
    { color: string; icon?: string; title?: string }
> = {
    default: { color: "primary", icon: undefined, title: "Notice" },
    success: { color: "success", icon: "mdi-check-circle", title: "Success" },
    info: { color: "info", icon: "mdi-information", title: "Info" },
    warning: { color: "warning", icon: "mdi-alert", title: "Warning" },
    error: { color: "error", icon: "mdi-alert-circle", title: "Error" },
};

interface BaseOptions {
    title?: string;
    text?: string;
    confirmText?: string;
    cancelText?: string;
    color?: string;
    width?: number | string;
    persistent?: boolean;
    icon?: string;
    variant?: DialogVariant;
}

interface PromptOptions extends BaseOptions {
    placeholder?: string;
    defaultValue?: string;
    type?: "text" | "password" | "email" | "number";
}

interface DialogState {
    open: boolean;
    kind: DialogKind | null;
    options: BaseOptions | PromptOptions | null;
    resolver: ((value: any) => void) | null;
    inputValue: string;
    variant: DialogVariant;
}

const state = reactive<DialogState>({
    open: false,
    kind: null,
    options: null,
    resolver: null,
    inputValue: "",
    variant: "default",
});

function _open(kind: DialogKind, options: BaseOptions | PromptOptions) {
    const variant = options.variant ?? "default";
    return new Promise<any>(resolve => {
        state.kind = kind;
        state.variant = variant;
        state.options = options;
        state.inputValue = (options as PromptOptions).defaultValue ?? "";
        state.open = true;
        state.resolver = resolve;
    });
}

function _resolve(val: any) {
    state.open = false;
    state.resolver?.(val);
    state.kind = null;
    state.options = null;
    state.resolver = null;
    state.inputValue = "";
    state.variant = "default";
}

function alert(text: string, opts: Omit<BaseOptions, "text"> = {}) {
    return _open("alert", { text, ...opts }).then(() => true);
}
function confirm(text: string, opts: Omit<BaseOptions, "text"> = {}) {
    return _open("confirm", { text, ...opts }) as Promise<boolean>;
}
function prompt(text: string, opts: Omit<PromptOptions, "text"> = {}) {
    return _open("prompt", { text, ...opts }) as Promise<string | null>;
}

/* helpers por variante */
const alertSuccess = (text: string, o: Omit<BaseOptions, "text"> = {}) =>
    alert(text, { variant: "success", ...o });
const alertInfo = (text: string, o: Omit<BaseOptions, "text"> = {}) =>
    alert(text, { variant: "info", ...o });
const alertWarning = (text: string, o: Omit<BaseOptions, "text"> = {}) =>
    alert(text, { variant: "warning", ...o });
const alertError = (text: string, o: Omit<BaseOptions, "text"> = {}) =>
    alert(text, { variant: "error", ...o });

const confirmSuccess = (text: string, o: Omit<BaseOptions, "text"> = {}) =>
    confirm(text, { variant: "success", ...o });
const confirmInfo = (text: string, o: Omit<BaseOptions, "text"> = {}) =>
    confirm(text, { variant: "info", ...o });
const confirmWarning = (text: string, o: Omit<BaseOptions, "text"> = {}) =>
    confirm(text, { variant: "warning", ...o });
const confirmError = (text: string, o: Omit<BaseOptions, "text"> = {}) =>
    confirm(text, { variant: "error", ...o });

const promptSuccess = (text: string, o: Omit<PromptOptions, "text"> = {}) =>
    prompt(text, { variant: "success", ...o });
const promptInfo = (text: string, o: Omit<PromptOptions, "text"> = {}) =>
    prompt(text, { variant: "info", ...o });
const promptWarning = (text: string, o: Omit<PromptOptions, "text"> = {}) =>
    prompt(text, { variant: "warning", ...o });
const promptError = (text: string, o: Omit<PromptOptions, "text"> = {}) =>
    prompt(text, { variant: "error", ...o });

export function useDialog() {
    return {
        state,
        alert,
        confirm,
        prompt,
        alertSuccess,
        alertInfo,
        alertWarning,
        alertError,
        confirmSuccess,
        confirmInfo,
        confirmWarning,
        confirmError,
        promptSuccess,
        promptInfo,
        promptWarning,
        promptError,
        resolve: _resolve,
        VARIANT_MAP, // opcional si quieres usarlo fuera
    };
}
