import { useMemo } from "react"
import type { PlayerLookupResult } from "@/lib/chesscom"
import { ONLINE_WITHIN_SEC } from "@/lib/chesscom"

const AVATAR_PX = 36

type Props = {
  rows: PlayerLookupResult[]
}

function onlinePlayers(rows: PlayerLookupResult[]): PlayerLookupResult[] {
  return rows
    .filter((row) => row.online)
    .sort((a, b) => {
      const byTime = (b.lastOnline ?? 0) - (a.lastOnline ?? 0)
      if (byTime !== 0) return byTime
      return a.username.localeCompare(b.username, undefined, {
        sensitivity: "base",
      })
    })
}

function displayRating(player: PlayerLookupResult): number | null {
  if (typeof player.rapid === "number") return player.rapid
  if (typeof player.blitz === "number") return player.blitz
  if (typeof player.bullet === "number") return player.bullet
  return null
}

function tickerNames(names: string[]): string[] {
  if (names.length === 0) return []
  const min = 8
  const copies = Math.max(1, Math.ceil(min / names.length))
  return Array.from({ length: copies }, () => names).flat()
}

function PlayerChip({
  player,
  index,
}: {
  player: PlayerLookupResult
  index: number
}) {
  const href = `https://www.chess.com/member/${encodeURIComponent(player.username)}`
  const initial = player.username.slice(0, 1).toUpperCase()
  const rating = displayRating(player)
  const floatDuration = `${3.2 + (index % 5) * 0.35}s`

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="online-now-chip group inline-flex items-center gap-2 rounded-full border border-brand/20 bg-surface/90 py-1 pr-3 pl-1 shadow-sm backdrop-blur-sm transition hover:border-brand/50 hover:shadow"
      style={{
        ["--float-duration" as string]: floatDuration,
      }}
    >
      <span className="relative h-9 w-9 shrink-0">
        <span className="online-now-avatar-ring absolute inset-0 rounded-full" />
        <span className="relative flex h-full w-full overflow-hidden rounded-full border border-brand/30 bg-brand-muted">
          {player.avatarUrl ? (
            <img
              src={player.avatarUrl}
              alt=""
              width={AVATAR_PX}
              height={AVATAR_PX}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-brand">
              {initial}
            </span>
          )}
        </span>
        <span
          className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full bg-brand ring-2 ring-surface"
          aria-hidden
        />
      </span>
      <span className="min-w-0 text-left">
        <span className="block max-w-28 truncate font-mono text-xs font-medium text-foreground group-hover:text-brand sm:max-w-36">
          {player.username}
        </span>
        <span className="block text-[10px] tabular-nums text-ink-muted">
          {rating != null ? rating : "Unrated"}
        </span>
      </span>
    </a>
  )
}

export function OnlineNowBox({ rows }: Props) {
  const online = useMemo(() => onlinePlayers(rows), [rows])
  const names = online.map((player) => player.username)
  const ticker = tickerNames(names)
  const minutes = ONLINE_WITHIN_SEC / 60
  const few = online.length > 0 && online.length <= 3

  return (
    <section
      id="online-now"
      aria-labelledby="online-now-heading"
      className="overflow-hidden rounded-xl border border-brand/25 bg-surface shadow-md"
    >
      <header className="flex flex-wrap items-end justify-between gap-2 border-b border-border px-4 py-3 sm:px-5">
        <div>
          <h2
            id="online-now-heading"
            className="font-display flex items-center gap-2 text-xl font-semibold tracking-tight sm:text-2xl"
          >
            <span className="online-live-dot" aria-hidden />
            Online now
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Tracked players with Chess.com activity in the last {minutes}{" "}
            minutes.
          </p>
        </div>
        <p className="text-sm font-medium tabular-nums text-brand">
          {online.length} {online.length === 1 ? "player" : "players"}
        </p>
      </header>

      <div className="online-now-board relative min-h-40">
        {online.length === 0 ? (
          <div className="flex min-h-40 flex-col items-center justify-center px-4 py-8 text-center">
            <img
              src="/queen.png"
              alt=""
              width={64}
              height={64}
              className="mb-3 h-14 w-14 object-contain opacity-30"
            />
            <p className="text-sm font-medium text-foreground">
              No one is online right now
            </p>
            <p className="mt-1 max-w-sm text-sm text-ink-muted">
              This box fills with avatars when tracked players are active on
              Chess.com.
            </p>
          </div>
        ) : (
          <>
            <ul
              className={
                few
                  ? "relative z-10 flex min-h-40 flex-wrap items-center justify-center gap-3 px-4 py-6"
                  : "relative z-10 flex min-h-40 flex-wrap content-center gap-2 px-4 py-5"
              }
              aria-label={
                names.length === 1
                  ? `${names[0]} is online`
                  : `${names.join(", ")} are online`
              }
            >
              {online.map((player, index) => (
                <li
                  key={player.username}
                  className="online-now-chip-in"
                  style={{ animationDelay: `${(index % 8) * 0.12}s` }}
                >
                  <PlayerChip player={player} index={index} />
                </li>
              ))}
            </ul>
            {online.length >= 3 ? (
              <div className="online-now-ticker" aria-hidden>
                <div className="online-now-ticker-track">
                  {[0, 1].map((half) => (
                    <div key={half} className="online-now-ticker-group">
                      {ticker.map((name, index) => (
                        <span
                          key={`${half}-${name}-${index}`}
                          className="font-mono text-[11px] tracking-wide text-brand/70"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  )
}
