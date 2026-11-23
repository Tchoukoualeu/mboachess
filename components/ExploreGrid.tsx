import type { ReactNode } from "react"
import { SiteNavLink } from "@/components/SiteNavLink"
import {
  SITE_LINKS,
  type SiteRoute,
  prodigeSeasonStatus,
} from "@/lib/navigation"

const ICON_PATHS: Partial<Record<SiteRoute, ReactNode>> = {
  "/prodige-league": (
    <>
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z" />
      <path d="M17 6h3v2a3 3 0 0 1-3 3M7 6H4v2a3 3 0 0 0 3 3" />
    </>
  ),
  "/puzzles": (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </>
  ),
  "/top-cameroon-chess-players": <path d="M4 20V11M10 20V4M16 20v-7M3 20h18" />,
  "/tournaments": (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  "/tournaments/past-online": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  "/rating-speed-run": <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />,
  "/clubs": (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M16 14.2a5 5 0 0 1 5 5.8" />
    </>
  ),
  "/content-creators": (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M10 9.5v5l4.5-2.5z" />
    </>
  ),
  "/chess-cameroon": (
    <>
      <path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </>
  ),
}

function Icon({ route }: { route: SiteRoute }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden
    >
      {ICON_PATHS[route]}
    </svg>
  )
}

export function ExploreGrid() {
  const season = prodigeSeasonStatus()
  const featureProdige = season !== "ended"
  const items = SITE_LINKS.filter(
    (item) => item.inExplore && !(featureProdige && item.to === "/prodige-league"),
  )
  const prodige = SITE_LINKS.find((item) => item.to === "/prodige-league")

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {featureProdige && prodige ? (
        <SiteNavLink
          item={prodige}
          className="hero-prodige group relative col-span-full flex items-center gap-4 overflow-hidden rounded-xl p-5 text-white shadow-md transition hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:p-6"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/10 text-gold ring-1 ring-white/15">
            <Icon route="/prodige-league" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-2">
              <span className="font-display text-lg font-semibold sm:text-xl">
                {prodige.label}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-gold ring-1 ring-gold/30">
                {season === "live" ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
                ) : null}
                {season === "live" ? "Season live" : "Starts 15 Nov"}
              </span>
            </span>
            <span className="mt-1 block text-sm text-white/75">
              {prodige.blurb}. Results, standings and sign-up.
            </span>
          </span>
          <span
            aria-hidden
            className="shrink-0 text-xl text-gold transition group-hover:translate-x-1"
          >
            →
          </span>
        </SiteNavLink>
      ) : null}

      {items.map((item) => (
        <SiteNavLink
          key={item.to}
          item={item}
          className="group flex items-center gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:flex-col sm:items-start"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-muted text-brand">
            <Icon route={item.to} />
          </span>
          <span>
            <span className="block font-medium text-foreground group-hover:text-brand">
              {item.label}
            </span>
            <span className="mt-0.5 block text-sm leading-5 text-ink-muted">
              {item.blurb}
            </span>
          </span>
        </SiteNavLink>
      ))}
    </div>
  )
}
