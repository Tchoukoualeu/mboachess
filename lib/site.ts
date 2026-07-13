/**
 * Public GitHub repository URL. Override with `VITE_GITHUB_URL` in `.env`.
 */
export const GITHUB_URL =
  readEnv("VITE_GITHUB_URL") || "https://github.com/Tchoukoualeu/mboachess"

/** WhatsApp community / chat link. Override with `VITE_WHATSAPP_URL`. */
export const WHATSAPP_URL =
  readEnv("VITE_WHATSAPP_URL") ||
  "https://chat.whatsapp.com/DjnXpGLYn18GoPNNAq3F2Z"

function readEnv(key: string): string | undefined {
  const fromImportMeta =
    typeof import.meta !== "undefined" && import.meta.env
      ? import.meta.env[key]
      : undefined
  const raw =
    (typeof fromImportMeta === "string" ? fromImportMeta : undefined) ||
    process.env[key]
  return typeof raw === "string" ? raw.replace(/\/$/, "") : undefined
}
