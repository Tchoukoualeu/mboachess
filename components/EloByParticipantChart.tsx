import type { PlayerLookupResult } from "@/lib/chesscom"

type Props = {
  rows: PlayerLookupResult[]
}

function average(values: number[]): number | null {
  if (values.length === 0) return null
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
}

function ratedPlayers(rows: PlayerLookupResult[]) {
  return rows
    .filter(
      (row) =>
        !row.error &&
        ((typeof row.blitz === "number" && row.blitz > 0) ||
          (typeof row.rapid === "number" && row.rapid > 0)),
    )
    .sort((a, b) => {
      const aRapid = typeof a.rapid === "number" ? a.rapid : -1
      const bRapid = typeof b.rapid === "number" ? b.rapid : -1
      if (bRapid !== aRapid) return bRapid - aRapid
      const aBlitz = typeof a.blitz === "number" ? a.blitz : -1
      const bBlitz = typeof b.blitz === "number" ? b.blitz : -1
      if (bBlitz !== aBlitz) return bBlitz - aBlitz
      return a.username.localeCompare(b.username)
    })
}

export function EloByParticipantChart({ rows }: Props) {
  const players = ratedPlayers(rows)
  const blitzValues = players
    .map((player) => player.blitz)
    .filter((value): value is number => typeof value === "number" && value > 0)
  const rapidValues = players
    .map((player) => player.rapid)
    .filter((value): value is number => typeof value === "number" && value > 0)

  const avgBlitz = average(blitzValues)
  const avgRapid = average(rapidValues)
  const maxRating = Math.max(...blitzValues, ...rapidValues, 1)

  if (players.length === 0) {
    return (
      <section className="mt-6 rounded-xl border border-dashed border-zinc-300 bg-white p-6 text-center dark:border-zinc-700 dark:bg-zinc-900/40">
        <h2 className="text-lg font-semibold">Elo by participant</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          No rated players to chart yet.
        </p>
      </section>
    )
  }

  return (
    <section
      className="mt-6 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50"
      aria-label="Elo by participant"
    >
      <div className="border-b border-zinc-200 px-4 py-4 dark:border-zinc-800 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Elo by participant</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Blitz and rapid ratings for every tracked player.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-medium">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
              Blitz
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-sky-50 px-2.5 py-1.5 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300">
              <span className="h-2 w-2 rounded-full bg-sky-500" aria-hidden />
              Rapid
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-emerald-50 px-3 py-3 dark:bg-emerald-900/20">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              Avg blitz
            </div>
            <div className="mt-1 text-2xl font-semibold tabular-nums text-emerald-900 dark:text-emerald-100">
              {avgBlitz ?? "—"}
            </div>
            <div className="mt-0.5 text-xs text-emerald-700/80 dark:text-emerald-300/80">
              {blitzValues.length} rated
            </div>
          </div>
          <div className="rounded-lg bg-sky-50 px-3 py-3 dark:bg-sky-900/20">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300">
              Avg rapid
            </div>
            <div className="mt-1 text-2xl font-semibold tabular-nums text-sky-900 dark:text-sky-100">
              {avgRapid ?? "—"}
            </div>
            <div className="mt-0.5 text-xs text-sky-700/80 dark:text-sky-300/80">
              {rapidValues.length} rated
            </div>
          </div>
        </div>
      </div>

      <div className="max-h-112 space-y-3 overflow-y-auto px-4 py-4 sm:px-6">
        {players.map((player) => {
          const blitz = typeof player.blitz === "number" && player.blitz > 0 ? player.blitz : null
          const rapid = typeof player.rapid === "number" && player.rapid > 0 ? player.rapid : null
          const blitzWidth = blitz == null ? 0 : Math.max((blitz / maxRating) * 100, 4)
          const rapidWidth = rapid == null ? 0 : Math.max((rapid / maxRating) * 100, 4)

          return (
            <div key={player.username} className="min-w-0">
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <a
                  href={`https://www.chess.com/member/${encodeURIComponent(player.username)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate font-mono text-xs text-emerald-700 underline decoration-emerald-700/30 underline-offset-2 hover:decoration-emerald-600 dark:text-emerald-400 dark:decoration-emerald-400/40 sm:text-sm"
                >
                  {player.username}
                </a>
                <div className="shrink-0 text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
                  <span className="text-emerald-700 dark:text-emerald-400">
                    {blitz ?? "—"}
                  </span>
                  <span className="mx-1 text-zinc-300 dark:text-zinc-600">/</span>
                  <span className="text-sky-700 dark:text-sky-400">{rapid ?? "—"}</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="h-2.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-emerald-500 dark:bg-emerald-400"
                    style={{ width: `${blitzWidth}%` }}
                    title={blitz == null ? "Unrated blitz" : `Blitz ${blitz}`}
                  />
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-sky-500 dark:bg-sky-400"
                    style={{ width: `${rapidWidth}%` }}
                    title={rapid == null ? "Unrated rapid" : `Rapid ${rapid}`}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
