import { createFileRoute, Link } from "@tanstack/react-router"
import { EloByParticipantChart } from "@/components/EloByParticipantChart"
import { PageShell } from "@/components/PageShell"
import { RatingLeaders } from "@/components/RatingLeaders"
import { SubmitUsernameForm } from "@/components/SubmitUsernameForm"
import { ONLINE_WITHIN_SEC } from "@/lib/chesscom"
import { pageHead, webPageJsonLd } from "@/lib/seo"
import { loadHomeData } from "@/server/home"

/** Convert ISO country code to flag emoji (e.g., "CM" -> "🇨🇲"). */
function countryCodeToFlag(code: string): string {
  return code
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("")
}

/** Map common country codes to full country names. */
const COUNTRY_NAMES: Record<string, string> = {
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
  GQ: "Equatorial Guinea",
}

function getCountryName(code: string | null): string {
  if (!code) return "Unknown"
  return COUNTRY_NAMES[code.toUpperCase()] || code.toUpperCase()
}

function formatLastSeen(unix: number | null): string {
  if (unix == null) return "—"
  const s = Date.now() / 1000 - unix
  if (s < 60) return "just now"
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

function formatRating(
  value: number | null,
  error: string | undefined,
): string | number {
  if (error && /not found/i.test(error)) return "—"
  if (value != null) return value
  if (error) return "—"
  return "Unrated"
}

const HOME_TITLE =
  "Mboachess - Chess in Cameroon | Players, Clubs & Tournaments"
const HOME_DESCRIPTION =
  "The hub for chess in Cameroon. Track Cameroonian chess players' ratings, discover local chess clubs, view upcoming tournaments, and connect with the chess community across Cameroon."

export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      title: HOME_TITLE,
      description: HOME_DESCRIPTION,
      path: "/",
      jsonLd: webPageJsonLd({
        title: HOME_TITLE,
        description: HOME_DESCRIPTION,
        path: "/",
      }),
    }),
  loader: () => loadHomeData(),
  component: Home,
})

function Home() {
  const { rows, blitzLeader, rapidLeader } = Route.useLoaderData()

  return (
    <>
      <section className="hero-board relative overflow-hidden text-white">
        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col justify-center px-4 py-10 sm:px-6 sm:py-12">
          <div className="animate-fade-up relative z-10 max-w-xl rounded-xl bg-black/35 px-4 py-4 backdrop-blur-[2px] sm:px-5 sm:py-5">
            <h1 className="font-display text-3xl font-semibold tracking-tight drop-shadow-sm sm:text-4xl md:text-5xl">
              Mboachess
            </h1>
            <p className="animate-fade-up-delay mt-2 max-w-md text-sm leading-6 text-white sm:text-base sm:leading-7">
              Follow Cameroonian players on Chess.com—ratings, activity, and the
              community in one place.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="#ratings"
                className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-brand transition hover:bg-brand-muted"
              >
                View ratings
              </a>
              <a
                href="#submit"
                className="inline-flex items-center justify-center rounded-lg border border-white/50 bg-white/15 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/25"
              >
                Add a player
              </a>
            </div>
          </div>
          <img
            src="/queen.png"
            alt=""
            width={180}
            height={180}
            className="animate-fade-in pointer-events-none absolute right-2 top-1/2 h-28 w-28 -translate-y-1/2 object-contain opacity-15 sm:right-6 sm:h-36 sm:w-36"
          />
        </div>
      </section>

      <PageShell className="pt-8 sm:pt-10">
        <section aria-labelledby="leaders-heading" className="mb-8">
          <h2
            id="leaders-heading"
            className="font-display text-xl font-semibold tracking-tight sm:text-2xl"
          >
            Leaders
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Top blitz and rapid ratings among tracked players.
          </p>
          <div className="mt-4">
            <RatingLeaders
              blitzLeader={blitzLeader}
              rapidLeader={rapidLeader}
            />
          </div>
        </section>

        <section aria-labelledby="explore-heading" className="mb-10">
          <h2
            id="explore-heading"
            className="font-display text-xl font-semibold tracking-tight sm:text-2xl"
          >
            Explore
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Tournaments, clubs, creators, and more across Cameroon chess.
          </p>
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {(
              [
                {
                  to: "/tournaments" as const,
                  label: "Tournaments",
                  blurb: "Upcoming events to play or follow",
                },
                {
                  to: "/tournaments/past-online" as const,
                  label: "Past online",
                  blurb: "Previous online tournament results",
                },
                {
                  to: "/rating-speed-run" as const,
                  label: "Rating speed run",
                  blurb: "Timed rating-gain competitions",
                  search: {} as Record<string, never>,
                },
                {
                  to: "/clubs" as const,
                  label: "Chess clubs",
                  blurb: "Local clubs and meetups",
                },
                {
                  to: "/content-creators" as const,
                  label: "Content creators",
                  blurb: "Streams, channels, and socials",
                },
                {
                  to: "/chess-cameroon" as const,
                  label: "Chess Cameroon",
                  blurb: "Start here if you searched for chess cameroon",
                },
              ] as const
            ).map((item) => (
              <li key={item.to}>
                {"search" in item && item.search !== undefined ? (
                  <Link
                    to={item.to}
                    search={item.search}
                    className="group flex items-baseline justify-between gap-4 py-3.5 transition hover:bg-brand-muted/40"
                  >
                    <span>
                      <span className="font-medium text-foreground group-hover:text-brand">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-sm text-ink-muted">
                        {item.blurb}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className="shrink-0 text-brand opacity-60 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                    >
                      →
                    </span>
                  </Link>
                ) : (
                  <Link
                    to={item.to}
                    className="group flex items-baseline justify-between gap-4 py-3.5 transition hover:bg-brand-muted/40"
                  >
                    <span>
                      <span className="font-medium text-foreground group-hover:text-brand">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-sm text-ink-muted">
                        {item.blurb}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className="shrink-0 text-brand opacity-60 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                    >
                      →
                    </span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section id="submit" aria-labelledby="submit-heading" className="mb-8">
          <h2
            id="submit-heading"
            className="font-display text-xl font-semibold tracking-tight sm:text-2xl"
          >
            Add a player
          </h2>
          <p className="mt-1 mb-4 text-sm text-ink-muted">
            Submit a Chess.com username to include them in the ratings table.
          </p>
          <SubmitUsernameForm />
        </section>

        <section id="ratings" aria-labelledby="ratings-heading">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2
                id="ratings-heading"
                className="font-display text-xl font-semibold tracking-tight sm:text-2xl"
              >
                Player ratings
              </h2>
              <p className="mt-1 text-sm text-ink-muted">
                Blitz and rapid from the Chess.com public API. Online (green
                dot) uses recent profile and game times within{" "}
                {ONLINE_WITHIN_SEC / 60} minutes.
              </p>
            </div>
            <p className="text-sm font-medium text-ink-muted">
              {rows.length} players
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border bg-surface shadow-sm">
            <table className="w-full min-w-xl text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 font-medium">Username</th>
                  <th className="px-4 py-3 font-medium">Blitz</th>
                  <th className="px-4 py-3 font-medium">Rapid</th>
                  <th className="px-4 py-3 font-medium" scope="col">
                    Online
                  </th>
                  <th className="px-4 py-3 font-medium text-ink-muted">
                    Last seen
                  </th>
                  <th className="px-4 py-3 font-medium">Country</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.username}
                    className="border-b border-border/70 last:border-0"
                  >
                    <td className="px-4 py-3 font-mono text-xs sm:text-sm">
                      <a
                        href={`https://www.chess.com/member/${encodeURIComponent(
                          r.username,
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
                      >
                        {r.username}
                      </a>
                    </td>
                    <td className="px-4 py-3 tabular-nums">
                      {formatRating(r.blitz, r.error)}
                    </td>
                    <td className="px-4 py-3 tabular-nums">
                      {formatRating(r.rapid, r.error)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        role="img"
                        aria-label={r.online ? "Online" : "Offline"}
                        title={r.online ? "Online" : "Offline"}
                        className={
                          r.online
                            ? "inline-block h-3 w-3 rounded-full bg-brand"
                            : "inline-block h-3 w-3 rounded-full bg-border"
                        }
                      />
                    </td>
                    <td className="px-4 py-3 tabular-nums text-ink-muted">
                      {formatLastSeen(r.lastOnline)}
                    </td>
                    <td className="px-4 py-3">
                      {r.countryCode ? (
                        <div className="group relative inline-block cursor-help">
                          <span className="text-2xl">
                            {countryCodeToFlag(r.countryCode)}
                          </span>
                          <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                            {getCountryName(r.countryCode)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-ink-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.some((r) => r.error) ? (
              <p className="border-t border-border px-4 py-3 text-xs text-wood">
                Some rows may be missing ratings:{" "}
                {rows
                  .filter((r) => r.error)
                  .map((r) => `${r.username} (${r.error})`)
                  .join("; ")}
              </p>
            ) : null}
          </div>

          <EloByParticipantChart rows={rows} />
        </section>
      </PageShell>
    </>
  )
}
