/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
  readonly VITE_SOCIAL_INSTAGRAM?: string;
  readonly VITE_SOCIAL_TWITTER?: string;
  readonly VITE_SOCIAL_YOUTUBE?: string;
}

declare namespace NodeJS {
  interface ProcessEnv {
    /** JSON webhook that receives contact / DMCA / newsletter submissions. */
    readonly FORM_WEBHOOK_URL?: string;
    readonly NODE_ENV?: "development" | "production" | "test";
  }
}
