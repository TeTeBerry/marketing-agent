/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_INTERNAL_API_URL?: string;
  readonly BACKEND_INTERNAL_API_URL?: string;
  readonly VITE_INTERNAL_API_KEY?: string;
  readonly INTERNAL_API_KEY?: string;
  readonly VITE_BRAND_VOICE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
