/**
 * Public GitHub repository URL. Override with `NEXT_PUBLIC_GITHUB_URL` in
 * `.env.local` if the repo moves.
 */
export const GITHUB_URL =
  process.env.NEXT_PUBLIC_GITHUB_URL?.replace(/\/$/, "") ||
  "https://github.com/Tchoukoualeu/mboachess";

/** WhatsApp community / chat link. Override with `NEXT_PUBLIC_WHATSAPP_URL`. */
export const WHATSAPP_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_URL?.replace(/\/$/, "") ||
  "https://chat.whatsapp.com/DjnXpGLYn18GoPNNAq3F2Z";
