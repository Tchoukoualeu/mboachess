import { fetchPlayerSnapshot, ONLINE_WITHIN_SEC } from "@/lib/chesscom"

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

export default async function Home() {
  const rows = []
  for (const u of TRACKED_USERNAMES) {
    rows.push(await fetchPlayerSnapshot(u))
    await new Promise((r) => setTimeout(r, 120))
  }

  return (
    <div className="min-h-dvh flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Chess.com players
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Blitz and rapid ratings from the public API. The online indicator
            uses the most recent of your profile &quot;last online&quot; time and
            the last blitz, rapid, or bullet game on your stats, within the
            last {ONLINE_WITHIN_SEC / 60} minutes. Chess.com does not publish a
            real-time online API.
          </p>
        </header>

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
