import { V as jsxRuntimeExports, O as useRouter, r as reactExports } from "../server.js";
import { c as Route, L as Link } from "./router-CKdnlwL4.js";
import { O as ONLINE_WITHIN_SEC } from "./chesscom-D1rMt3aW.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./chesscomUsernames-Cvwz24GZ.js";
import "./mongodb-BSnNLwqh.js";
import "timers/promises";
import "timers";
import "fs";
import "http";
import "process";
import "events";
import "dns";
import "url";
import "zlib";
import "net";
import "fs/promises";
import "tls";
import "child_process";
import "./tournaments-Ijxn2pDm.js";
import "./contentCreators-BNaY_jwK.js";
import "./clubs-BYYazxhC.js";
const __vite_import_meta_env__ = { "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SSR": true, "TSS_DEV_SERVER": "false", "TSS_DEV_SSR_STYLES_BASEPATH": "/", "TSS_DEV_SSR_STYLES_ENABLED": "true", "TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false", "TSS_INLINE_CSS_ENABLED": "false", "TSS_ROUTER_BASEPATH": "", "TSS_SERVER_FN_BASE": "/_serverFn/" };
const GITHUB_URL = readEnv("VITE_GITHUB_URL") || "https://github.com/Tchoukoualeu/mboachess";
const WHATSAPP_URL = readEnv("VITE_WHATSAPP_URL") || "https://chat.whatsapp.com/DjnXpGLYn18GoPNNAq3F2Z";
function readEnv(key) {
  const fromImportMeta = typeof import.meta !== "undefined" && __vite_import_meta_env__ ? __vite_import_meta_env__[key] : void 0;
  const raw = (typeof fromImportMeta === "string" ? fromImportMeta : void 0) || process.env[key];
  return typeof raw === "string" ? raw.replace(/\/$/, "") : void 0;
}
function GitHubIcon({ className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "svg",
    {
      className,
      viewBox: "0 0 16 16",
      fill: "currentColor",
      "aria-hidden": true,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" })
    }
  );
}
function GitHubLink() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "a",
    {
      href: GITHUB_URL,
      target: "_blank",
      rel: "noreferrer",
      className: "inline-flex shrink-0 items-center justify-center rounded-lg border border-zinc-200 p-2 text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-100",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(GitHubIcon, { className: "h-5 w-5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "View source on GitHub" })
      ]
    }
  );
}
function WhatsAppIcon({ className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "svg",
    {
      className,
      viewBox: "0 0 24 24",
      fill: "currentColor",
      "aria-hidden": true,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" })
    }
  );
}
function WhatsAppLink() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "a",
    {
      href: WHATSAPP_URL,
      target: "_blank",
      rel: "noreferrer",
      className: "inline-flex shrink-0 items-center justify-center rounded-lg border border-zinc-200 p-2 text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-100",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(WhatsAppIcon, { className: "h-5 w-5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Join WhatsApp community" })
      ]
    }
  );
}
function CrownIcon({ className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "svg",
    {
      className,
      viewBox: "0 0 15 15",
      fill: "currentColor",
      "aria-hidden": true,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M2.5 4.5C2.5 3.95 2.95 3.5 3.5 3.5C4.05 3.5 4.5 3.95 4.5 4.5C4.5 5.05 4.05 5.5 3.5 5.5C2.95 5.5 2.5 5.05 2.5 4.5ZM7.5 2.5C7.5 1.95 7.95 1.5 8.5 1.5C9.05 1.5 9.5 1.95 9.5 2.5C9.5 3.05 9.05 3.5 8.5 3.5C7.95 3.5 7.5 3.05 7.5 2.5ZM12.5 4.5C12.5 3.95 12.95 3.5 13.5 3.5C14.05 3.5 14.5 3.95 14.5 4.5C14.5 5.05 14.05 5.5 13.5 5.5C12.95 5.5 12.5 5.05 12.5 4.5ZM12.5 6.5L13.5 12.5C13.5 12.78 13.28 13 13 13H2C1.72 13 1.5 12.78 1.5 12.5L2.5 6.5C2.5 6.22 2.72 6 3 6H4.5C4.5 4.57 5.57 3.5 7 3.5C8.43 3.5 9.5 4.57 9.5 6H12C12.22 6 12.5 6.22 12.5 6.5Z" })
    }
  );
}
const AVATAR_PX = 48;
function Leader({
  kind,
  leader,
  rating
}) {
  if (!leader || rating == null) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1 rounded-lg border border-zinc-200/90 bg-zinc-50/90 px-2 py-2 text-center dark:border-zinc-800 dark:bg-zinc-900/50 sm:px-3 sm:py-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400", children: [
        "Top ",
        kind
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-xs text-zinc-500", children: "—" })
    ] });
  }
  const href = `https://www.chess.com/member/${encodeURIComponent(leader.username)}`;
  const initial = leader.username.slice(0, 1).toUpperCase();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "a",
    {
      href,
      target: "_blank",
      rel: "noreferrer",
      className: "group flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-amber-200/70 bg-linear-to-r from-amber-50/80 to-white py-1.5 pl-1.5 pr-2 shadow-sm transition hover:border-amber-300/90 hover:shadow dark:border-amber-900/40 dark:from-amber-950/20 dark:to-zinc-900/60 sm:gap-2.5 sm:rounded-xl sm:py-2 sm:pl-2 sm:pr-3",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-10 w-10 shrink-0 sm:h-12 sm:w-12", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "pointer-events-none absolute top-0 left-1/2 z-10 -translate-x-1/2 translate-y-[-20%] sm:translate-y-[-15%]",
              "aria-hidden": true,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(CrownIcon, { className: "h-3.5 w-3.5 text-amber-500 drop-shadow sm:h-4 sm:w-4 dark:text-amber-400" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-full w-full overflow-hidden rounded-full border border-amber-200/90 bg-zinc-100 dark:border-amber-600/40 dark:bg-zinc-800", children: leader.avatarUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: leader.avatarUrl,
              alt: "",
              width: AVATAR_PX,
              height: AVATAR_PX,
              className: "h-full w-full object-cover"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-full w-full items-center justify-center text-sm font-semibold text-zinc-500 sm:text-base", children: initial }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1 text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-semibold uppercase leading-tight tracking-wide text-amber-800/80 dark:text-amber-200/85", children: [
            "Top ",
            kind
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-base font-bold leading-tight tabular-nums text-zinc-900 sm:text-lg dark:text-zinc-100", children: rating }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[11px] font-medium text-zinc-600 group-hover:underline sm:text-xs dark:text-zinc-300", children: leader.username })
        ] })
      ]
    }
  );
}
function RatingLeaders({ blitzLeader, rapidLeader }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      className: "mb-3 sm:mb-5",
      "aria-label": "Highest rated players",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 sm:gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Leader,
          {
            kind: "Blitz",
            leader: blitzLeader,
            rating: blitzLeader?.blitz ?? null
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Leader,
          {
            kind: "Rapid",
            leader: rapidLeader,
            rating: rapidLeader?.rapid ?? null
          }
        )
      ] })
    }
  );
}
function SubmitUsernameForm() {
  const router = useRouter();
  const [value, setValue] = reactExports.useState("");
  const [message, setMessage] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  async function onSubmit(e) {
    e.preventDefault();
    setMessage(null);
    const username = value.trim();
    if (!username) {
      setMessage({ type: "err", text: "Enter your Chess.com username." });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/submit-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({
          type: "err",
          text: data.error || "Request failed"
        });
        return;
      }
      if (data.already) {
        setMessage({
          type: "ok",
          text: "That username is already in the list."
        });
        setValue("");
        await router.invalidate();
        return;
      }
      setMessage({
        type: "ok",
        text: "Your username was added. It will show in the table below."
      });
      setValue("");
      await router.invalidate();
    } catch {
      setMessage({ type: "err", text: "Network error. Try again." });
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 max-w-xl sm:mb-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "form",
      {
        onSubmit,
        className: "flex flex-col gap-3 sm:flex-row sm:items-end",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "chess-username",
                className: "mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300",
                children: "Add your Chess.com username"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "chess-username",
                name: "username",
                type: "text",
                autoComplete: "username",
                placeholder: "e.g. hikaru",
                value,
                onChange: (e) => setValue(e.target.value),
                disabled: loading,
                className: "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 font-mono text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-600"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "submit",
              disabled: loading,
              className: "h-10 shrink-0 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200",
              children: loading ? "Saving…" : "Save"
            }
          )
        ]
      }
    ),
    message ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "p",
      {
        role: "status",
        className: `mt-2 text-sm ${message.type === "ok" ? "text-emerald-700 dark:text-emerald-300" : "text-red-600 dark:text-red-400"}`,
        children: message.text
      }
    ) : null
  ] });
}
function countryCodeToFlag(code) {
  return code.toUpperCase().split("").map((char) => String.fromCodePoint(127397 + char.charCodeAt(0))).join("");
}
const COUNTRY_NAMES = {
  CM: "Cameroon",
  US: "United States",
  GB: "United Kingdom",
  FR: "France",
  DE: "Germany",
  ES: "Spain",
  IT: "Italy",
  CA: "Canada",
  AU: "Australia",
  BR: "Brazil",
  AR: "Argentina",
  MX: "Mexico",
  IN: "India",
  CN: "China",
  JP: "Japan",
  KR: "South Korea",
  RU: "Russia",
  UA: "Ukraine",
  PL: "Poland",
  NL: "Netherlands",
  BE: "Belgium",
  CH: "Switzerland",
  AT: "Austria",
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  FI: "Finland",
  PT: "Portugal",
  GR: "Greece",
  TR: "Turkey",
  ZA: "South Africa",
  EG: "Egypt",
  NG: "Nigeria",
  KE: "Kenya",
  GH: "Ghana",
  MA: "Morocco",
  TN: "Tunisia",
  DZ: "Algeria",
  SN: "Senegal",
  CI: "Ivory Coast",
  UG: "Uganda",
  TZ: "Tanzania",
  ET: "Ethiopia",
  ZW: "Zimbabwe",
  BW: "Botswana",
  RW: "Rwanda",
  CD: "DR Congo",
  CG: "Congo",
  GA: "Gabon",
  ML: "Mali",
  BF: "Burkina Faso",
  NE: "Niger",
  TD: "Chad",
  CF: "Central African Republic",
  GQ: "Equatorial Guinea"
};
function getCountryName(code) {
  if (!code) return "Unknown";
  return COUNTRY_NAMES[code.toUpperCase()] || code.toUpperCase();
}
function formatLastSeen(unix) {
  if (unix == null) return "—";
  const s = Date.now() / 1e3 - unix;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}
function formatRating(value, error) {
  if (error && /not found/i.test(error)) return "—";
  if (value != null) return value;
  if (error) return "—";
  return "Unrated";
}
function Home() {
  const {
    rows,
    blitzLeader,
    rapidLeader
  } = Route.useLoaderData();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-dvh flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto w-full max-w-4xl flex-1 px-4 py-5 sm:px-6 sm:py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-start sm:justify-between sm:gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl", children: "Mboachess.com" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1.5 max-w-2xl text-xs leading-5 text-zinc-600 sm:mt-2 sm:text-sm sm:leading-6 dark:text-zinc-400", children: [
          "Blitz and rapid ratings and activity from the Chess.com public API. Online (green dot) uses recent profile and game times within",
          " ",
          ONLINE_WITHIN_SEC / 60,
          " minutes."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-wrap gap-x-1 text-xs leading-5 text-zinc-600 sm:text-sm sm:leading-6 dark:text-zinc-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "Looking for ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "chess cameroon" }),
            "? See",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/chess-cameroon", className: "text-emerald-700 underline decoration-emerald-700/30 underline-offset-2 hover:decoration-emerald-600 dark:text-emerald-400 dark:decoration-emerald-400/40", children: "Chess Cameroon" }),
            " • "
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "View",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/tournaments", className: "text-emerald-700 underline decoration-emerald-700/30 underline-offset-2 hover:decoration-emerald-600 dark:text-emerald-400 dark:decoration-emerald-400/40", children: "Upcoming Tournaments" }),
            " • "
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "Find",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/clubs", className: "text-emerald-700 underline decoration-emerald-700/30 underline-offset-2 hover:decoration-emerald-600 dark:text-emerald-400 dark:decoration-emerald-400/40", children: "Chess Clubs" }),
            " • "
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "Discover",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/content-creators", className: "text-emerald-700 underline decoration-emerald-700/30 underline-offset-2 hover:decoration-emerald-600 dark:text-emerald-400 dark:decoration-emerald-400/40", children: "Content Creators" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 items-center gap-2 sm:pt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(GitHubLink, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(WhatsAppLink, {})
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(RatingLeaders, { blitzLeader, rapidLeader }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 grid gap-4 sm:mb-6 sm:grid-cols-2 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/tournaments", className: "block rounded-xl border border-emerald-200 bg-emerald-50 p-4 transition hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:hover:border-emerald-800 dark:hover:bg-emerald-900/30 sm:p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-emerald-900 dark:text-emerald-100", children: "Tournaments" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-emerald-700 dark:text-emerald-300", children: "View and add upcoming chess tournaments" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "h-5 w-5 shrink-0 text-emerald-700 dark:text-emerald-300", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/clubs", className: "block rounded-xl border border-blue-200 bg-blue-50 p-4 transition hover:border-blue-300 hover:bg-blue-100 dark:border-blue-900/50 dark:bg-blue-900/20 dark:hover:border-blue-800 dark:hover:bg-blue-900/30 sm:p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-blue-900 dark:text-blue-100", children: "Chess Clubs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-blue-700 dark:text-blue-300", children: "Find and join local chess clubs" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "h-5 w-5 shrink-0 text-blue-700 dark:text-blue-300", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/content-creators", className: "block rounded-xl border border-purple-200 bg-purple-50 p-4 transition hover:border-purple-300 hover:bg-purple-100 dark:border-purple-900/50 dark:bg-purple-900/20 dark:hover:border-purple-800 dark:hover:bg-purple-900/30 sm:p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-purple-900 dark:text-purple-100", children: "Content Creators" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-purple-700 dark:text-purple-300", children: "Discover chess content creators" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "h-5 w-5 shrink-0 text-purple-700 dark:text-purple-300", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SubmitUsernameForm, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 flex items-center justify-between rounded-lg bg-zinc-100 px-4 py-3 dark:bg-zinc-800/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-zinc-700 dark:text-zinc-300", children: [
      "Total players:",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-700 dark:text-emerald-400", children: rows.length })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full min-w-xl text-left text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-zinc-200 dark:border-zinc-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Username" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Blitz" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Rapid" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", scope: "col", children: "Online" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400", children: "Last seen" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Country" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-zinc-100 last:border-0 dark:border-zinc-800/80", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono text-xs sm:text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `https://www.chess.com/member/${encodeURIComponent(r.username)}`, target: "_blank", rel: "noreferrer", className: "text-emerald-700 underline decoration-emerald-700/30 underline-offset-2 hover:decoration-emerald-600 dark:text-emerald-400 dark:decoration-emerald-400/40", children: r.username }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 tabular-nums", children: formatRating(r.blitz, r.error) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 tabular-nums", children: formatRating(r.rapid, r.error) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { role: "img", "aria-label": r.online ? "Online" : "Offline", title: r.online ? "Online" : "Offline", className: r.online ? "inline-block h-3 w-3 rounded-full bg-emerald-500 dark:bg-emerald-400" : "inline-block h-3 w-3 rounded-full bg-zinc-300 dark:bg-zinc-500" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-zinc-600 tabular-nums dark:text-zinc-400", children: formatLastSeen(r.lastOnline) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: r.countryCode ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group relative inline-block cursor-help", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: countryCodeToFlag(r.countryCode) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-zinc-100 dark:text-zinc-900", children: getCountryName(r.countryCode) })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-400", children: "—" }) })
        ] }, r.username)) })
      ] }),
      rows.some((r) => r.error) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "border-t border-zinc-200 px-4 py-3 text-xs text-amber-800 dark:border-zinc-800 dark:text-amber-200/90", children: [
        "Some rows may be missing ratings:",
        " ",
        rows.filter((r) => r.error).map((r) => `${r.username} (${r.error})`).join("; ")
      ] }) : null
    ] })
  ] }) });
}
export {
  Home as component
};
