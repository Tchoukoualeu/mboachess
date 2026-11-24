import { useState } from "react"
import { Await } from "@tanstack/react-router"
import { fill, intlLocale, noun, useDictionary, useLocale } from "@/lib/i18n"
import type { ProdigeLeaguePlayer } from "@/lib/prodigeLeague"

const PAGE_SIZE = 20

function countryCodeToFlag(code: string): string {
  return code
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("")
}

function formatRating(value: number | null): string {
  return typeof value === "number" ? String(value) : "—"
}

function formatRegisteredAt(iso: string, locale: ReturnType<typeof useLocale>): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime()) || date.getTime() === 0) return ""
  return new Intl.DateTimeFormat(intlLocale(locale), {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}

function PlayerRow({
  player,
  rank,
}: {
  player: ProdigeLeaguePlayer
  rank: number
}) {
  const dict = useDictionary()
  const copy = dict.prodigeSignup
  const locale = useLocale()
  const href = `https://www.chess.com/member/${encodeURIComponent(player.username)}`
  const registered = formatRegisteredAt(player.registeredAt, locale)
  const flag = player.countryCode ? countryCodeToFlag(player.countryCode) : null

  return (
    <li className="border-b border-border last:border-b-0">
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="group flex items-center gap-3 px-3 py-3 transition hover:bg-brand-muted/40 sm:gap-4 sm:px-4"
      >
        <span className="w-8 shrink-0 text-center font-mono text-sm tabular-nums text-ink-muted sm:w-10">
          {rank}
        </span>
        <div className="relative h-10 w-10 shrink-0">
          <div className="h-10 w-10 overflow-hidden rounded-full border border-border bg-surface-muted">
            {player.avatarUrl ? (
              <img
                src={player.avatarUrl}
                alt=""
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-ink-muted">
                {player.username.slice(0, 1).toUpperCase()}
              </span>
            )}
          </div>
          {player.online ? (
            <span
              className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-surface bg-brand"
              title={copy.online}
            />
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-foreground group-hover:text-brand group-hover:underline">
            {player.username}
            {flag ? (
              <span className="ml-1.5" title={player.countryCode ?? undefined}>
                {flag}
              </span>
            ) : null}
          </p>
          <p className="mt-0.5 text-xs text-ink-muted">
            {registered
              ? fill(copy.registeredOn, { date: registered })
              : copy.registered}
            {" · "}
            {dict.common.blitz} {formatRating(player.blitz)}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-mono text-base font-semibold tabular-nums text-foreground sm:text-lg">
            {formatRating(player.rapid)}
          </p>
          <p className="text-[11px] uppercase tracking-wide text-ink-muted">
            {dict.common.rapid}
          </p>
        </div>
      </a>
    </li>
  )
}

function PlayerList({ players }: { players: ProdigeLeaguePlayer[] | null }) {
  const copy = useDictionary().prodigeSignup
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  if (players === null) {
    return (
      <p className="mt-3 rounded-xl border border-dashed border-border bg-surface px-4 py-10 text-center text-sm text-ink-muted">
        {copy.loadFailed}
      </p>
    )
  }

  if (players.length === 0) {
    return (
      <p className="mt-3 rounded-xl border border-dashed border-border bg-surface px-4 py-10 text-center text-sm text-ink-muted">
        {copy.empty}
      </p>
    )
  }

  const visible = players.slice(0, visibleCount)
  const remaining = Math.max(0, players.length - visibleCount)
  const nextBatch = Math.min(PAGE_SIZE, remaining)

  return (
    <>
      <ol className="mt-3 overflow-hidden rounded-xl border border-border">
        {visible.map((player, index) => (
          <PlayerRow key={player.username} player={player} rank={index + 1} />
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
            {fill(copy.more, { count: nextBatch })}
          </button>
        </div>
      ) : null}
    </>
  )
}

function SignupSummary({
  players,
}: {
  players: Promise<ProdigeLeaguePlayer[] | null>
}) {
  const copy = useDictionary().prodigeSignup
  const locale = useLocale()
  return (
    <section id="inscription" className="mb-4">
      <details className="group rounded-xl border border-border bg-surface">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
          <span>
            <span className="font-display block text-lg font-semibold tracking-tight">
              {copy.title}
            </span>
            <span className="mt-0.5 block text-sm text-ink-muted">
              {copy.closed}
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-3">
            <span className="text-sm text-ink-muted">
              <Await promise={players} fallback="…">
                {(list) =>
                  list
                    ? fill(copy.count, {
                        count: list.length,
                        noun: noun(locale, list.length),
                      })
                    : ""
                }
              </Await>
            </span>
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden
              className="h-4 w-4 text-ink-muted transition group-open:rotate-180"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </summary>

        <div className="border-t border-border px-4 py-4">
          <p className="max-w-2xl text-sm leading-6 text-ink-muted">{copy.sorted}</p>
          <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">
            {copy.playersTitle}
          </h3>

          <Await
            promise={players}
            fallback={
              <p className="mt-3 rounded-xl border border-dashed border-border bg-surface px-4 py-10 text-center text-sm text-ink-muted">
                {copy.loading}
              </p>
            }
          >
            {(list) => <PlayerList players={list} />}
          </Await>
        </div>
      </details>
    </section>
  )
}

export function ProdigeLeagueSignup({
  players,
}: {
  players: Promise<ProdigeLeaguePlayer[] | null>
}) {
  return <SignupSummary players={players} />
}
