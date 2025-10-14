/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string;
    readonly VITE_APP_STAGE: string;
    readonly VITE_API_URL?: string;
    readonly VITE_API_TOKEN?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}