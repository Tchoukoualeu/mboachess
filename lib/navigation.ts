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

export type SiteLink = {
  to: SiteRoute
  label: string
  blurb: string
  /** Shown in the desktop header (space is limited there). */
  inHeader: boolean
  /** Shown as a card in the home page "Explore" grid. */
  inExplore: boolean
}

/** Single source for header, mobile menu, footer, and home Explore links. */
export const SITE_LINKS: readonly SiteLink[] = [
  {
    to: "/",
    label: "Players",
    blurb: "Ratings and activity of tracked players",
    inHeader: true,
    inExplore: false,
  },
  {
    to: "/prodige-league",
    label: "Prodige League",
    blurb: "Online rapid season, 15 Nov–31 Dec 2026",
    inHeader: true,
    inExplore: true,
  },
  {
    to: "/puzzles",
    label: "Puzzles",
    blurb: "Solve tactics from Lichess",
    inHeader: true,
    inExplore: true,
  },
  {
    to: "/top-cameroon-chess-players",
    label: "Top 100",
    blurb: "Best Cameroon blitz and rapid on Chess.com",
    inHeader: true,
    inExplore: true,
  },
  {
    to: "/tournaments",
    label: "Tournaments",
    blurb: "Upcoming events to play or follow",
    inHeader: true,
    inExplore: true,
  },
  {
    to: "/tournaments/past-online",
    label: "Past online",
    blurb: "Previous online tournament results",
    inHeader: false,
    inExplore: true,
  },
  {
    to: "/rating-speed-run",
    label: "Speed run",
    blurb: "Timed rating-gain competitions",
    inHeader: true,
    inExplore: true,
  },
  {
    to: "/clubs",
    label: "Clubs",
    blurb: "Local clubs and meetups",
    inHeader: true,
    inExplore: true,
  },
  {
    to: "/content-creators",
    label: "Creators",
    blurb: "Streams, channels, and socials",
    inHeader: true,
    inExplore: true,
  },
  {
    to: "/chess-cameroon",
    label: "Chess Cameroon",
    blurb: "Start here if you searched for chess cameroon",
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
