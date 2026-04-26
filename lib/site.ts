/**
 * Public GitHub repository URL. Override with `NEXT_PUBLIC_GITHUB_URL` in
 * `.env.local` if the repo moves.
 */
export const GITHUB_URL =
  process.env.NEXT_PUBLIC_GITHUB_URL?.replace(/\/$/, "") ||
  "https://github.com/Tchoukoualeu/mboachess";
