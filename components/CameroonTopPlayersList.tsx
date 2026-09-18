import { useState } from "react"
import type {
  CameroonTopPlayer,
  TopPlayerMode,
} from "@/lib/cameroonTopPlayers"

const PAGE_SIZE = 20

type Props = {
  blitz: CameroonTopPlayer[]
  rapid: CameroonTopPlayer[]
}

function PlayerRow({ player }: { player: CameroonTopPlayer }) {
  const href = `https://www.chess.com/member/${encodeURIComponent(player.username)}`

  return (
    <li className="border-b border-border last:border-b-0">
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="group flex items-center gap-3 px-3 py-3 transition hover:bg-brand-muted/40 sm:gap-4 sm:px-4"
      >
        <span className="w-8 shrink-0 text-center font-mono text-sm tabular-nums text-ink-muted sm:w-10">
          {player.rank}
        </span>
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-surface-muted">
          {player.avatarUrl ? (
            <img
              src={player.avatarUrl}
              alt=""
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          ) : (
            <span
              className="flex h-full w-full items-center justify-center text-xl leading-none"
              aria-label="Cameroon"
              title="Cameroon"
            >
              🇨🇲
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-foreground group-hover:text-brand group-hover:underline">
            {player.username}
          </p>
          <p className="mt-0.5 text-xs text-ink-muted">
            {player.winCount}W / {player.lossCount}L / {player.drawCount}D
            {player.gameCount > 0 ? ` · ${player.gameCount} games` : null}
          </p>
        </div>
        <span className="shrink-0 font-mono text-base font-semibold tabular-nums text-foreground sm:text-lg">
          {player.rating}
        </span>
      </a>
    </li>
  )
}

export function CameroonTopPlayersList({ blitz, rapid }: Props) {
  const [mode, setMode] = useState<TopPlayerMode>("blitz")
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const players = mode === "blitz" ? blitz : rapid
  const visible = players.slice(0, visibleCount)
  const remaining = Math.max(0, players.length - visibleCount)
  const nextBatch = Math.min(PAGE_SIZE, remaining)

  function switchMode(next: TopPlayerMode) {
    setMode(next)
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Rating type"
        className="mb-4 flex gap-1 rounded-lg border border-border bg-surface-muted/60 p-1"
      >
        {(
          [
            { id: "blitz" as const, label: "Best blitz" },
            { id: "rapid" as const, label: "Best rapid" },
          ] as const
        ).map((tab) => {
          const selected = mode === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => switchMode(tab.id)}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${
                selected
                  ? "bg-surface text-foreground shadow-sm"
                  : "text-ink-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {players.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-surface px-4 py-10 text-center text-sm text-ink-muted">
          Could not load the Chess.com country leaderboard right now. Try again
          shortly.
        </p>
      ) : (
        <>
          <div className="mb-2 flex items-end justify-between gap-2 px-1 text-sm text-ink-muted">
            <p>
              Showing {visible.length} of {players.length}
            </p>
            <p className="capitalize">{mode} rating</p>
          </div>

          <ol className="overflow-hidden rounded-xl border border-border bg-surface">
            {visible.map((player) => (
              <PlayerRow key={`${mode}-${player.username}`} player={player} />
            ))}
          </ol>

          {remaining > 0 ? (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() =>
                  setVisibleCount((count) =>
                    Math.min(players.length, count + PAGE_SIZE),
                  )
                }
                className="inline-flex items-center justify-center rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-brand/40 hover:bg-brand-muted/50"
              >
                Load more ({nextBatch})
              </button>
            </div>
          ) : (
            <p className="mt-4 text-center text-sm text-ink-muted">
              Full top {players.length} list loaded.
            </p>
          )}
        </>
      )}
    </div>
  )
}
