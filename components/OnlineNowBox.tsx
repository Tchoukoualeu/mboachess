import { useMemo } from "react"
import type { PlayerLookupResult } from "@/lib/chesscom"
import { ONLINE_WITHIN_SEC } from "@/lib/chesscom"
import { fill, noun, useDictionary, useLocale } from "@/lib/i18n"

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

function PlayerChip({ player }: { player: PlayerLookupResult }) {
  const href = `https://www.chess.com/member/${encodeURIComponent(player.username)}`
  const initial = player.username.slice(0, 1).toUpperCase()
  const rating = displayRating(player)

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group inline-flex items-center gap-2 rounded-full border border-brand/20 bg-surface py-1 pr-3 pl-1 shadow-sm transition hover:-translate-y-0.5 hover:border-brand/50 hover:shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <span className="relative h-9 w-9 shrink-0">
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
          {rating != null ? rating : useUnrated()}
        </span>
      </span>
    </a>
  )
}

function useUnrated() {
  return useDictionary().common.unrated
}

export function OnlineNowBox({ rows }: Props) {
  const dict = useDictionary()
  const locale = useLocale()
  const online = useMemo(() => onlinePlayers(rows), [rows])
  const names = online.map((player) => player.username)
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
            {dict.online.title}
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            {fill(dict.online.description, { minutes })}
          </p>
        </div>
        <p className="text-sm font-medium tabular-nums text-brand">
          {fill(dict.online.count, {
            count: online.length,
            noun: noun(locale, online.length),
          })}
        </p>
      </header>

      <div className="online-now-board relative">
        {online.length === 0 ? (
          <div className="flex min-h-32 flex-col items-center justify-center px-4 py-8 text-center">
            <img
              src="/queen.png"
              alt=""
              width={64}
              height={64}
              className="mb-3 h-14 w-14 object-contain opacity-30"
            />
            <p className="text-sm font-medium text-foreground">
              {dict.online.emptyTitle}
            </p>
            <p className="mt-1 max-w-sm text-sm text-ink-muted">
              {dict.online.emptyBody}
            </p>
          </div>
        ) : (
          <ul
            className={
              few
                ? "flex min-h-32 flex-wrap items-center justify-center gap-3 px-4 py-6"
                : "flex flex-wrap gap-2 px-4 py-5"
            }
            aria-label={
              names.length === 1
                ? fill(dict.online.oneOnline, { name: names[0] })
                : fill(dict.online.manyOnline, { names: names.join(", ") })
            }
          >
            {online.map((player, index) => (
              <li
                key={player.username}
                className="online-now-chip-in"
                style={{ animationDelay: `${(index % 8) * 0.12}s` }}
              >
                <PlayerChip player={player} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
