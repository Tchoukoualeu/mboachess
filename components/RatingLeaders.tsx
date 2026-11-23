import { useMemo } from "react"
import { CrownIcon } from "@/components/CrownIcon"
import type { PlayerLookupResult } from "@/lib/chesscom"
import { topNByRating } from "@/lib/ratingLeaders"

const AVATAR_PX = 40
const PODIUM_SIZE = 3

type Mode = "blitz" | "rapid"

type Props = {
  rows: PlayerLookupResult[]
}

const MODE_STYLES: Record<Mode, { label: string; dot: string; text: string }> =
  {
    blitz: { label: "Blitz", dot: "bg-brand", text: "text-brand" },
    rapid: { label: "Rapid", dot: "bg-wood", text: "text-wood" },
  }

function Avatar({ player, size }: { player: PlayerLookupResult; size: string }) {
  return (
    <span
      className={`flex shrink-0 overflow-hidden rounded-full border border-border bg-brand-muted ${size}`}
    >
      {player.avatarUrl ? (
        <img
          src={player.avatarUrl}
          alt=""
          width={AVATAR_PX}
          height={AVATAR_PX}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-brand">
          {player.username.slice(0, 1).toUpperCase()}
        </span>
      )}
    </span>
  )
}

function Podium({ mode, players }: { mode: Mode; players: PlayerLookupResult[] }) {
  const style = MODE_STYLES[mode]

  return (
    <div className="rounded-xl border border-border bg-surface shadow-sm">
      <h3 className="flex items-center gap-2 border-b border-border px-4 py-3 text-sm font-semibold">
        <span className={`h-2 w-2 rounded-full ${style.dot}`} aria-hidden />
        Top {style.label}
      </h3>
      {players.length === 0 ? (
        <p className="px-4 py-6 text-center text-sm text-ink-muted">
          No rated players yet.
        </p>
      ) : (
        <ol>
          {players.map((player, index) => {
            const first = index === 0
            return (
              <li key={player.username} className="border-b border-border/70 last:border-0">
                <a
                  href={`https://www.chess.com/member/${encodeURIComponent(player.username)}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`group flex items-center gap-3 px-4 transition hover:bg-brand-muted/40 ${
                    first ? "py-3" : "py-2.5"
                  }`}
                >
                  <span
                    className={`w-4 shrink-0 text-center text-sm font-semibold tabular-nums ${
                      first ? "text-wood" : "text-ink-muted"
                    }`}
                  >
                    {first ? <CrownIcon className="h-4 w-4" /> : index + 1}
                    {first ? <span className="sr-only">1</span> : null}
                  </span>
                  <Avatar player={player} size={first ? "h-10 w-10" : "h-8 w-8"} />
                  <span className="min-w-0 flex-1 truncate font-mono text-sm group-hover:text-brand">
                    {player.username}
                  </span>
                  <span
                    className={`shrink-0 font-semibold tabular-nums ${
                      first ? `text-lg ${style.text}` : "text-sm"
                    }`}
                  >
                    {player[mode]}
                  </span>
                </a>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}

export function RatingLeaders({ rows }: Props) {
  const blitz = useMemo(() => topNByRating(rows, "blitz", PODIUM_SIZE), [rows])
  const rapid = useMemo(() => topNByRating(rows, "rapid", PODIUM_SIZE), [rows])

  return (
    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
      <Podium mode="blitz" players={blitz} />
      <Podium mode="rapid" players={rapid} />
    </div>
  )
}
