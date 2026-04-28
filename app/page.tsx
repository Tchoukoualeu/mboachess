import { GitHubLink } from "@/components/GitHubLink"
import { WhatsAppLink } from "@/components/WhatsAppLink"
import { RatingLeaders } from "@/components/RatingLeaders"
import { SubmitUsernameForm } from "@/components/SubmitUsernameForm"
import Link from "next/link"
import { getSubmittedUsernames } from "@/lib/chesscomUsernames"
import {
  type PlayerLookupResult,
  fetchPlayerSnapshot,
  ONLINE_WITHIN_SEC,
} from "@/lib/chesscom"
import { topByRating } from "@/lib/ratingLeaders"

export const dynamic = "force-dynamic"

const TRACKED_USERNAMES = [
  "menxele",
  "brlliantmoves",
  "aris2021222324",
  "amicodi1pelato",
  "open2doorwithin",
] as const

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

function uniqueSortedUsernames(
  a: readonly string[],
  b: string[]
): string[] {
  return [...new Set([...a, ...b])].sort((x, y) => x.localeCompare(y))
}

/** Highest rapid first; missing/unrated rapid at the bottom, then by username. */
function sortByRapidDesc(rows: PlayerLookupResult[]) {
  rows.sort((a, b) => {
    const aNum = typeof a.rapid === "number" ? a.rapid : Number.NEGATIVE_INFINITY
    const bNum = typeof b.rapid === "number" ? b.rapid : Number.NEGATIVE_INFINITY
    if (bNum !== aNum) return bNum - aNum
    return a.username.localeCompare(b.username, undefined, { sensitivity: "base" })
  })
}

export default async function Home() {
  const fromDb = await getSubmittedUsernames()
  const usernames = uniqueSortedUsernames(TRACKED_USERNAMES, fromDb)
  const rows = []
  for (const u of usernames) {
    rows.push(await fetchPlayerSnapshot(u))
    await new Promise((r) => setTimeout(r, 120))
  }

  sortByRapidDesc(rows)

  const blitzLeader = topByRating(rows, "blitz")
  const rapidLeader = topByRating(rows, "rapid")

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
            <p className="mt-2 max-w-2xl text-xs leading-5 text-zinc-600 sm:text-sm sm:leading-6 dark:text-zinc-400">
              Looking for <span className="font-medium">chess cameroon</span>? See{" "}
              <Link
                href="/chess-cameroon"
                className="text-emerald-700 underline decoration-emerald-700/30 underline-offset-2 hover:decoration-emerald-600 dark:text-emerald-400 dark:decoration-emerald-400/40"
              >
                Chess Cameroon
              </Link>
              .
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:pt-1">
            <GitHubLink />
            <WhatsAppLink />
          </div>
        </header>

        <RatingLeaders blitzLeader={blitzLeader} rapidLeader={rapidLeader} />

        <SubmitUsernameForm />

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
