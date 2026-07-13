import { createFileRoute, Link } from "@tanstack/react-router"
import { GitHubLink } from "@/components/GitHubLink"
import { WhatsAppLink } from "@/components/WhatsAppLink"
import { RatingLeaders } from "@/components/RatingLeaders"
import { SubmitUsernameForm } from "@/components/SubmitUsernameForm"
import { ONLINE_WITHIN_SEC } from "@/lib/chesscom"
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

export const Route = createFileRoute("/")({
  loader: () => loadHomeData(),
  component: Home,
})

function Home() {
  const { rows, blitzLeader, rapidLeader } = Route.useLoaderData()

  return (
    <div className="min-h-dvh flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-5 sm:px-6 sm:py-8">
        <header className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl">
              Mboachess.com
            </h1>
            <p className="mt-1.5 max-w-2xl text-xs leading-5 text-zinc-600 sm:mt-2 sm:text-sm sm:leading-6 dark:text-zinc-400">
              Blitz and rapid ratings and activity from the Chess.com public
              API. Online (green dot) uses recent profile and game times within{" "}
              {ONLINE_WITHIN_SEC / 60} minutes.
            </p>
            <div className="mt-2 flex flex-wrap gap-x-1 text-xs leading-5 text-zinc-600 sm:text-sm sm:leading-6 dark:text-zinc-400">
              <p>
                Looking for <span className="font-medium">chess cameroon</span>?
                See{" "}
                <Link
                  to="/chess-cameroon"
                  className="text-emerald-700 underline decoration-emerald-700/30 underline-offset-2 hover:decoration-emerald-600 dark:text-emerald-400 dark:decoration-emerald-400/40"
                >
                  Chess Cameroon
                </Link>
                {" • "}
              </p>
              <p>
                View{" "}
                <Link
                  to="/tournaments"
                  className="text-emerald-700 underline decoration-emerald-700/30 underline-offset-2 hover:decoration-emerald-600 dark:text-emerald-400 dark:decoration-emerald-400/40"
                >
                  Upcoming Tournaments
                </Link>
                {" • "}
              </p>
              <p>
                Find{" "}
                <Link
                  to="/clubs"
                  className="text-emerald-700 underline decoration-emerald-700/30 underline-offset-2 hover:decoration-emerald-600 dark:text-emerald-400 dark:decoration-emerald-400/40"
                >
                  Chess Clubs
                </Link>
                {" • "}
              </p>
              <p>
                Discover{" "}
                <Link
                  to="/content-creators"
                  className="text-emerald-700 underline decoration-emerald-700/30 underline-offset-2 hover:decoration-emerald-600 dark:text-emerald-400 dark:decoration-emerald-400/40"
                >
                  Content Creators
                </Link>
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:pt-1">
            <GitHubLink />
            <WhatsAppLink />
          </div>
        </header>

        <RatingLeaders blitzLeader={blitzLeader} rapidLeader={rapidLeader} />

        <div className="mb-4 grid gap-4 sm:mb-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/tournaments"
            className="block rounded-xl border border-emerald-200 bg-emerald-50 p-4 transition hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:hover:border-emerald-800 dark:hover:bg-emerald-900/30 sm:p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                  Tournaments
                </h2>
                <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
                  View and add upcoming chess tournaments
                </p>
              </div>
              <svg
                className="h-5 w-5 shrink-0 text-emerald-700 dark:text-emerald-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>

          <Link
            to="/clubs"
            className="block rounded-xl border border-blue-200 bg-blue-50 p-4 transition hover:border-blue-300 hover:bg-blue-100 dark:border-blue-900/50 dark:bg-blue-900/20 dark:hover:border-blue-800 dark:hover:bg-blue-900/30 sm:p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                  Chess Clubs
                </h2>
                <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                  Find and join local chess clubs
                </p>
              </div>
              <svg
                className="h-5 w-5 shrink-0 text-blue-700 dark:text-blue-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>

          <Link
            to="/content-creators"
            className="block rounded-xl border border-purple-200 bg-purple-50 p-4 transition hover:border-purple-300 hover:bg-purple-100 dark:border-purple-900/50 dark:bg-purple-900/20 dark:hover:border-purple-800 dark:hover:bg-purple-900/30 sm:p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-purple-900 dark:text-purple-100">
                  Content Creators
                </h2>
                <p className="mt-1 text-sm text-purple-700 dark:text-purple-300">
                  Discover chess content creators
                </p>
              </div>
              <svg
                className="h-5 w-5 shrink-0 text-purple-700 dark:text-purple-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        </div>

        <SubmitUsernameForm />

        <div className="mb-4 flex items-center justify-between rounded-lg bg-zinc-100 px-4 py-3 dark:bg-zinc-800/50">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Total players:{" "}
            <span className="text-emerald-700 dark:text-emerald-400">
              {rows.length}
            </span>
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <table className="w-full min-w-xl text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-4 py-3 font-medium">Username</th>
                <th className="px-4 py-3 font-medium">Blitz</th>
                <th className="px-4 py-3 font-medium">Rapid</th>
                <th className="px-4 py-3 font-medium" scope="col">
                  Online
                </th>
                <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                  Last seen
                </th>
                <th className="px-4 py-3 font-medium">Country</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.username}
                  className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/80"
                >
                  <td className="px-4 py-3 font-mono text-xs sm:text-sm">
                    <a
                      href={`https://www.chess.com/member/${encodeURIComponent(
                        r.username,
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-700 underline decoration-emerald-700/30 underline-offset-2 hover:decoration-emerald-600 dark:text-emerald-400 dark:decoration-emerald-400/40"
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
                          ? "inline-block h-3 w-3 rounded-full bg-emerald-500 dark:bg-emerald-400"
                          : "inline-block h-3 w-3 rounded-full bg-zinc-300 dark:bg-zinc-500"
                      }
                    />
                  </td>
                  <td className="px-4 py-3 text-zinc-600 tabular-nums dark:text-zinc-400">
                    {formatLastSeen(r.lastOnline)}
                  </td>
                  <td className="px-4 py-3">
                    {r.countryCode ? (
                      <div className="group relative inline-block cursor-help">
                        <span className="text-2xl">
                          {countryCodeToFlag(r.countryCode)}
                        </span>
                        <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-zinc-100 dark:text-zinc-900">
                          {getCountryName(r.countryCode)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-zinc-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.some((r) => r.error) ? (
            <p className="border-t border-zinc-200 px-4 py-3 text-xs text-amber-800 dark:border-zinc-800 dark:text-amber-200/90">
              Some rows may be missing ratings:{" "}
              {rows
                .filter((r) => r.error)
                .map((r) => `${r.username} (${r.error})`)
                .join("; ")}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
