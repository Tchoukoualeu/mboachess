import { O as useRouter, r as reactExports, V as jsxRuntimeExports } from "../server.js";
import { R as Route, L as Link } from "./router-CKdnlwL4.js";
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
function AddTournamentForm() {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = reactExports.useState(false);
  const [formData, setFormData] = reactExports.useState({
    name: "",
    startDate: "",
    endDate: "",
    location: "",
    description: "",
    link: "",
    phone: "",
    isOnline: false
  });
  const [message, setMessage] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  async function onSubmit(e) {
    e.preventDefault();
    setMessage(null);
    if (!formData.name.trim()) {
      setMessage({ type: "err", text: "Tournament name is required." });
      return;
    }
    if (!formData.startDate) {
      setMessage({ type: "err", text: "Start date is required." });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/submit-tournament", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({
          type: "err",
          text: data.error || "Request failed"
        });
        return;
      }
      setMessage({
        type: "ok",
        text: "Tournament added successfully!"
      });
      setFormData({
        name: "",
        startDate: "",
        endDate: "",
        location: "",
        description: "",
        link: "",
        phone: "",
        isOnline: false
      });
      await router.invalidate();
    } catch {
      setMessage({ type: "err", text: "Network error. Try again." });
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setIsExpanded(!isExpanded),
        className: "flex w-full items-center justify-between p-4 text-left transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50 sm:p-6",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Add New Tournament" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-zinc-600 dark:text-zinc-400", children: "Submit your own tournament to share with the community" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "svg",
            {
              className: `h-5 w-5 shrink-0 text-zinc-600 transition-transform dark:text-zinc-400 ${isExpanded ? "rotate-180" : ""}`,
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                  d: "M19 9l-7 7-7-7"
                }
              )
            }
          )
        ]
      }
    ),
    isExpanded && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "form",
      {
        onSubmit,
        className: "space-y-4 border-t border-zinc-200 p-4 dark:border-zinc-800 sm:p-6",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "name",
                className: "mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300",
                children: "Tournament Name *"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "name",
                name: "name",
                type: "text",
                placeholder: "e.g. National Chess Championship 2026",
                value: formData.name,
                onChange: (e) => setFormData({ ...formData, name: e.target.value }),
                disabled: loading,
                className: "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-600"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "startDate",
                  className: "mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300",
                  children: "Start Date *"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "startDate",
                  name: "startDate",
                  type: "datetime-local",
                  value: formData.startDate,
                  onChange: (e) => setFormData({ ...formData, startDate: e.target.value }),
                  disabled: loading,
                  className: "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-600"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "endDate",
                  className: "mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300",
                  children: "End Date"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "endDate",
                  name: "endDate",
                  type: "datetime-local",
                  value: formData.endDate,
                  onChange: (e) => setFormData({ ...formData, endDate: e.target.value }),
                  disabled: loading,
                  className: "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-600"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "location",
                className: "mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300",
                children: "Location"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "location",
                name: "location",
                type: "text",
                placeholder: "e.g. Yaoundé, Cameroon",
                value: formData.location,
                onChange: (e) => setFormData({ ...formData, location: e.target.value }),
                disabled: loading,
                className: "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-600"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "isOnline",
                name: "isOnline",
                type: "checkbox",
                checked: formData.isOnline,
                onChange: (e) => setFormData({ ...formData, isOnline: e.target.checked }),
                disabled: loading,
                className: "h-4 w-4 rounded border-zinc-300 text-emerald-700 focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-emerald-600"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "isOnline",
                className: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
                children: "This is an online tournament"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "link",
                className: "mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300",
                children: "Tournament Link"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "link",
                name: "link",
                type: "url",
                placeholder: "e.g. https://chess.com/tournament/...",
                value: formData.link,
                onChange: (e) => setFormData({ ...formData, link: e.target.value }),
                disabled: loading,
                className: "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-600"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "phone",
                className: "mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300",
                children: "Contact Phone"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "phone",
                name: "phone",
                type: "tel",
                placeholder: "e.g. +237 659 46 17 38",
                value: formData.phone,
                onChange: (e) => setFormData({ ...formData, phone: e.target.value }),
                disabled: loading,
                className: "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-600"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "description",
                className: "mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300",
                children: "Description"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                id: "description",
                name: "description",
                rows: 3,
                placeholder: "Brief description of the tournament...",
                value: formData.description,
                onChange: (e) => setFormData({ ...formData, description: e.target.value }),
                disabled: loading,
                className: "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-600"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "submit",
              disabled: loading,
              className: "w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 sm:w-auto",
              children: loading ? "Adding…" : "Add Tournament"
            }
          ),
          message ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              role: "status",
              className: `mt-3 text-sm ${message.type === "ok" ? "text-emerald-700 dark:text-emerald-300" : "text-red-600 dark:text-red-400"}`,
              children: message.text
            }
          ) : null
        ]
      }
    )
  ] });
}
function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function getDaysUntil(date) {
  const now = /* @__PURE__ */ new Date();
  const diff = new Date(date).getTime() - now.getTime();
  return Math.ceil(diff / (1e3 * 60 * 60 * 24));
}
function TournamentsPage() {
  const tournaments = Route.useLoaderData();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-dvh flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto w-full max-w-4xl flex-1 px-4 py-5 sm:px-6 sm:py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-4 sm:mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl", children: "Tournaments" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "text-sm text-emerald-700 underline decoration-emerald-700/30 underline-offset-2 hover:decoration-emerald-600 dark:text-emerald-400 dark:decoration-emerald-400/40", children: "Back to Home" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-2xl text-xs leading-5 text-zinc-600 sm:text-sm sm:leading-6 dark:text-zinc-400", children: "Upcoming chess tournaments. Add your tournament to share it with the community." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AddTournamentForm, {}),
    tournaments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-zinc-600 dark:text-zinc-400", children: "No upcoming tournaments yet. Be the first to add one!" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300", children: [
        "Upcoming Tournaments (",
        tournaments.length,
        ")"
      ] }),
      tournaments.map((tournament, index) => {
        const daysUntil = getDaysUntil(tournament.startDate);
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-zinc-900 dark:text-zinc-100", children: tournament.name }),
              tournament.isOnline && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "h-3 w-3", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" }) }),
                "Online"
              ] })
            ] }),
            tournament.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-zinc-600 dark:text-zinc-400", children: tournament.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 space-y-1.5 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-zinc-700 dark:text-zinc-300", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "h-4 w-4 text-zinc-500 dark:text-zinc-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Starts:",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: formatDate(tournament.startDate) })
                ] })
              ] }),
              tournament.endDate && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-zinc-700 dark:text-zinc-300", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "h-4 w-4 text-zinc-500 dark:text-zinc-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Ends:",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: formatDate(tournament.endDate) })
                ] })
              ] }),
              tournament.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-zinc-700 dark:text-zinc-300", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "h-4 w-4 text-zinc-500 dark:text-zinc-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: tournament.location })
              ] }),
              tournament.link && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "h-4 w-4 text-zinc-500 dark:text-zinc-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: tournament.link, target: "_blank", rel: "noopener noreferrer", className: "text-emerald-700 underline decoration-emerald-700/30 underline-offset-2 hover:decoration-emerald-600 dark:text-emerald-400 dark:decoration-emerald-400/40", children: "Tournament Link" })
              ] }),
              tournament.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-zinc-700 dark:text-zinc-300", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "h-4 w-4 text-zinc-500 dark:text-zinc-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `tel:${tournament.phone.split("/")[0].trim()}`, className: "text-emerald-700 hover:underline dark:text-emerald-400", children: tournament.phone })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 flex-col items-start gap-1 rounded-lg bg-emerald-50 px-3 py-2 dark:bg-emerald-900/20 sm:items-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-emerald-700 dark:text-emerald-400", children: daysUntil }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium uppercase text-emerald-700 dark:text-emerald-400", children: daysUntil === 1 ? "day left" : "days left" })
          ] })
        ] }) }, index);
      })
    ] })
  ] }) });
}
export {
  TournamentsPage as component
};
