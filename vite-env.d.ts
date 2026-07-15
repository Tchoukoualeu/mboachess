/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GITHUB_URL?: string
  readonly VITE_WHATSAPP_URL?: string
  // Add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Declare CSS modules with ?url suffix
declare module "*.css?url" {
  const url: string
  export default url
}
