import type { Dictionary } from "@/locales/fr"

export type SiteRoute =
  | "/"
  | "/puzzles"
  | "/top-cameroon-chess-players"
  | "/tournaments"
  | "/prodige-league"
  | "/tournaments/past-online"
  | "/rating-speed-run"
  | "/clubs"
  | "/content-creators"
  | "/chess-cameroon"

export type SiteLinkId = keyof Dictionary["nav"]["links"]

export type SiteLink = {
  to: SiteRoute
  id: SiteLinkId
  /** Shown in the desktop header (space is limited there). */
  inHeader: boolean
  /** Shown as a card in the home page "Explore" grid. */
  inExplore: boolean
}

/** Single source for header, mobile menu, footer, and home Explore links. */
export const SITE_LINKS: readonly SiteLink[] = [
  { to: "/", id: "players", inHeader: true, inExplore: false },
  { to: "/prodige-league", id: "prodige", inHeader: true, inExplore: true },
  { to: "/puzzles", id: "puzzles", inHeader: true, inExplore: true },
  {
    to: "/top-cameroon-chess-players",
    id: "top",
    inHeader: true,
    inExplore: true,
  },
  { to: "/tournaments", id: "tournaments", inHeader: true, inExplore: true },
  {
    to: "/tournaments/past-online",
    id: "pastOnline",
    inHeader: false,
    inExplore: true,
  },
  { to: "/rating-speed-run", id: "speedRun", inHeader: true, inExplore: true },
  { to: "/clubs", id: "clubs", inHeader: true, inExplore: true },
  { to: "/content-creators", id: "creators", inHeader: true, inExplore: true },
  {
    to: "/chess-cameroon",
    id: "chessCameroon",
    inHeader: false,
    inExplore: true,
  },
]

export const PRODIGE_SEASON = {
  start: "2026-11-15T00:00:00+01:00",
  end: "2026-12-31T23:59:59+01:00",
} as const

export function prodigeSeasonStatus(
  now: Date = new Date(),
): "upcoming" | "live" | "ended" {
  const time = now.getTime()
  if (time < new Date(PRODIGE_SEASON.start).getTime()) return "upcoming"
  if (time > new Date(PRODIGE_SEASON.end).getTime()) return "ended"
  return "live"
}
