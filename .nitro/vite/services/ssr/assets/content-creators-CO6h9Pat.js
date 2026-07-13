import { O as useRouter, r as reactExports, V as jsxRuntimeExports } from "../server.js";
import { a as Route, L as Link } from "./router-CKdnlwL4.js";
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
function AddContentCreatorForm() {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = reactExports.useState(false);
  const [formData, setFormData] = reactExports.useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    youtube: "",
    twitter: "",
    instagram: "",
    facebook: "",
    twitch: "",
    contentType: "",
    description: ""
  });
  const [message, setMessage] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  async function onSubmit(e) {
    e.preventDefault();
    setMessage(null);
    if (!formData.name.trim()) {
      setMessage({ type: "err", text: "Creator name is required." });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/submit-creator", {
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
        text: "Content creator added successfully!"
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        website: "",
        youtube: "",
        twitter: "",
        instagram: "",
        facebook: "",
        twitch: "",
        contentType: "",
        description: ""
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
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Add Content Creator" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-zinc-600 dark:text-zinc-400", children: "Share your chess content with the community" })
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
                children: "Creator Name *"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "name",
                name: "name",
                type: "text",
                placeholder: "e.g. ChessMaster Pro",
                value: formData.name,
                onChange: (e) => setFormData({ ...formData, name: e.target.value }),
                disabled: loading,
                className: "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-600"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "contentType",
                className: "mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300",
                children: "Content Type"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "contentType",
                name: "contentType",
                type: "text",
                placeholder: "e.g. Videos, Streams, Articles, Tutorials",
                value: formData.contentType,
                onChange: (e) => setFormData({ ...formData, contentType: e.target.value }),
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
                placeholder: "Brief description of your content...",
                value: formData.description,
                onChange: (e) => setFormData({ ...formData, description: e.target.value }),
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
                  htmlFor: "email",
                  className: "mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300",
                  children: "Email"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "email",
                  name: "email",
                  type: "email",
                  placeholder: "creator@example.com",
                  value: formData.email,
                  onChange: (e) => setFormData({ ...formData, email: e.target.value }),
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
                  children: "Phone"
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
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "website",
                className: "mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300",
                children: "Website"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "website",
                name: "website",
                type: "url",
                placeholder: "https://...",
                value: formData.website,
                onChange: (e) => setFormData({ ...formData, website: e.target.value }),
                disabled: loading,
                className: "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-600"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300", children: "Social Media Links" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "youtube",
                    className: "mb-1 block text-sm text-zinc-600 dark:text-zinc-400",
                    children: "YouTube"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "youtube",
                    name: "youtube",
                    type: "url",
                    placeholder: "https://youtube.com/@username",
                    value: formData.youtube,
                    onChange: (e) => setFormData({ ...formData, youtube: e.target.value }),
                    disabled: loading,
                    className: "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-600"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "twitch",
                    className: "mb-1 block text-sm text-zinc-600 dark:text-zinc-400",
                    children: "Twitch"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "twitch",
                    name: "twitch",
                    type: "url",
                    placeholder: "https://twitch.tv/username",
                    value: formData.twitch,
                    onChange: (e) => setFormData({ ...formData, twitch: e.target.value }),
                    disabled: loading,
                    className: "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-600"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "twitter",
                    className: "mb-1 block text-sm text-zinc-600 dark:text-zinc-400",
                    children: "Twitter/X"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "twitter",
                    name: "twitter",
                    type: "url",
                    placeholder: "https://twitter.com/username",
                    value: formData.twitter,
                    onChange: (e) => setFormData({ ...formData, twitter: e.target.value }),
                    disabled: loading,
                    className: "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-600"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "instagram",
                    className: "mb-1 block text-sm text-zinc-600 dark:text-zinc-400",
                    children: "Instagram"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "instagram",
                    name: "instagram",
                    type: "url",
                    placeholder: "https://instagram.com/username",
                    value: formData.instagram,
                    onChange: (e) => setFormData({ ...formData, instagram: e.target.value }),
                    disabled: loading,
                    className: "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-600"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "facebook",
                    className: "mb-1 block text-sm text-zinc-600 dark:text-zinc-400",
                    children: "Facebook"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "facebook",
                    name: "facebook",
                    type: "url",
                    placeholder: "https://facebook.com/username",
                    value: formData.facebook,
                    onChange: (e) => setFormData({ ...formData, facebook: e.target.value }),
                    disabled: loading,
                    className: "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-600"
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "submit",
              disabled: loading,
              className: "w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 sm:w-auto",
              children: loading ? "Adding…" : "Add Content Creator"
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
function ContentCreatorsPage() {
  const creators = Route.useLoaderData();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-dvh flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto w-full max-w-4xl flex-1 px-4 py-5 sm:px-6 sm:py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-4 sm:mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl", children: "Content Creators" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "text-sm text-emerald-700 underline decoration-emerald-700/30 underline-offset-2 hover:decoration-emerald-600 dark:text-emerald-400 dark:decoration-emerald-400/40", children: "Back to Home" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-2xl text-xs leading-5 text-zinc-600 sm:text-sm sm:leading-6 dark:text-zinc-400", children: "Discover chess content creators from Cameroon. Share your content and connect with the community." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AddContentCreatorForm, {}),
    creators.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-zinc-600 dark:text-zinc-400", children: "No content creators yet. Be the first to add your profile!" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300", children: [
        "All Creators (",
        creators.length,
        ")"
      ] }),
      creators.map((creator, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-zinc-900 dark:text-zinc-100", children: creator.name }),
          creator.contentType && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-xs text-emerald-700 dark:text-emerald-400", children: creator.contentType }),
          creator.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-zinc-600 dark:text-zinc-400", children: creator.description })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 text-sm", children: [
          creator.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-zinc-700 dark:text-zinc-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "h-4 w-4 text-zinc-500 dark:text-zinc-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `tel:${creator.phone}`, className: "text-emerald-700 hover:underline dark:text-emerald-400", children: creator.phone })
          ] }),
          creator.email && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "h-4 w-4 text-zinc-500 dark:text-zinc-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `mailto:${creator.email}`, className: "text-emerald-700 hover:underline dark:text-emerald-400", children: creator.email })
          ] }),
          creator.website && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "h-4 w-4 text-zinc-500 dark:text-zinc-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: creator.website, target: "_blank", rel: "noopener noreferrer", className: "text-emerald-700 underline decoration-emerald-700/30 underline-offset-2 hover:decoration-emerald-600 dark:text-emerald-400 dark:decoration-emerald-400/40", children: "Visit Website" })
          ] })
        ] }),
        (creator.youtube || creator.twitch || creator.twitter || creator.instagram || creator.facebook) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 text-xs font-medium text-zinc-600 dark:text-zinc-400", children: "Social Media" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
            creator.youtube && /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: creator.youtube, target: "_blank", rel: "noopener noreferrer", className: "flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700", children: "YouTube" }),
            creator.twitch && /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: creator.twitch, target: "_blank", rel: "noopener noreferrer", className: "flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700", children: "Twitch" }),
            creator.twitter && /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: creator.twitter, target: "_blank", rel: "noopener noreferrer", className: "flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700", children: "Twitter" }),
            creator.instagram && /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: creator.instagram, target: "_blank", rel: "noopener noreferrer", className: "flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700", children: "Instagram" }),
            creator.facebook && /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: creator.facebook, target: "_blank", rel: "noopener noreferrer", className: "flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700", children: "Facebook" })
          ] })
        ] })
      ] }) }, index))
    ] })
  ] }) });
}
export {
  ContentCreatorsPage as component
};
