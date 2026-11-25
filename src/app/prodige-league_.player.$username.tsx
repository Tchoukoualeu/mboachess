import { createFileRoute, notFound } from "@tanstack/react-router"
import { LocaleLink } from "@/components/LocaleLink"
import { PageShell } from "@/components/PageShell"
import {
  fill,
  getDictionary,
  useDictionary,
  useLocale,
  useRouteLoaderData,
  type Locale,
} from "@/lib/i18n"
import { formatArenaDate } from "@/lib/prodigeArenaSchedule"
import { pageHead } from "@/lib/seo"
import type { ProdigePlayerGameResult } from "@/lib/prodigeArenaResults"
import {
  loadProdigePlayer,
  type ProdigePlayerPageData,
} from "@/server/prodigePlayer"

function formatPoints(points: number): string {
  return Number.isInteger(points) ? String(points) : points.toFixed(1)
}

function formatRating(value: number | null): string | null {
  return typeof value === "number" ? String(value) : null
}

function countryCodeToFlag(code: string): string {
  return code
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("")
}

function placeLabel(place: number, locale: Locale): string {
  if (locale === "fr") return place === 1 ? "1er" : `${place}e`
  const mod100 = place % 100
  const mod10 = place % 10
  const suffix =
    mod100 >= 11 && mod100 <= 13
      ? "th"
      : mod10 === 1
        ? "st"
        : mod10 === 2
          ? "nd"
          : mod10 === 3
            ? "rd"
            : "th"
  return `${place}${suffix}`
}

function resultClass(result: ProdigePlayerGameResult): string {
  if (result === "win") return "text-brand"
  if (result === "loss") return "text-wood"
  return "text-ink-muted"
}

export function playerHead(
  locale: Locale,
  loaderData: unknown,
  usernameParam: string,
) {
  const copy = getDictionary(locale).prodigePlayer
  const player = loaderData as ProdigePlayerPageData | undefined
  const username = player?.username ?? usernameParam
  const title = fill(copy.metaTitle, { username })
  const description = player
    ? fill(copy.metaDescription, {
        username: player.username,
        points: formatPoints(player.points),
        arenas: player.arenas.length,
        games: player.gamesPlayed,
      })
    : fill(copy.metaDescriptionFallback, { username })
  return pageHead({
    title,
    description,
    path: `/prodige-league/player/${encodeURIComponent(username)}`,
    locale,
  })
}

export const Route = createFileRoute("/prodige-league_/player/$username")({
  head: ({ loaderData, params }) => playerHead("fr", loaderData, params.username),
  loader: async ({ params }): Promise<ProdigePlayerPageData> => {
    const player = await loadProdigePlayer({ data: params.username })
    if (!player) throw notFound()
    return player
  },
  component: ProdigePlayerPage,
})

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <li className="rounded-xl border border-border bg-surface px-3 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
        {label}
      </p>
      <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-foreground">
        {value}
      </p>
    </li>
  )
}

export function ProdigePlayerPage() {
  const dict = useDictionary()
  const copy = dict.prodigePlayer
  const arenaCopy = dict.prodigeArena
  const common = dict.common
  const locale = useLocale()
  const player = useRouteLoaderData<ProdigePlayerPageData>()
  const rapid = formatRating(player.rapid)
  const blitz = formatRating(player.blitz)
  const bullet = formatRating(player.bullet)
  const ratings = [
    rapid ? fill(copy.rating, { label: common.rapid, rating: rapid }) : null,
    blitz ? fill(copy.rating, { label: common.blitz, rating: blitz }) : null,
    bullet ? fill(copy.rating, { label: common.bullet, rating: bullet }) : null,
  ].filter((item): item is string => item !== null)

  function resultLabel(result: ProdigePlayerGameResult): string {
    if (result === "win") return copy.win
    if (result === "draw") return copy.draw
    if (result === "loss") return copy.loss
    return "—"
  }

  return (
    <PageShell>
      <header className="mb-8">
        <p className="mb-4">
          <LocaleLink
            to="/prodige-league"
            className="text-sm text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
          >
            {arenaCopy.back}
          </LocaleLink>
        </p>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-border bg-surface-muted">
            {player.avatarUrl ? (
              <img
                src={player.avatarUrl}
                alt=""
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-xl font-semibold text-ink-muted">
                {player.username.slice(0, 1).toUpperCase()}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-wood">
              Prodige League
            </p>
            <h1 className="font-display mt-1 truncate text-3xl font-semibold tracking-tight sm:text-4xl">
              {player.countryCode ? (
                <span className="mr-2" title={player.countryCode}>
                  {countryCodeToFlag(player.countryCode)}
                </span>
              ) : null}
              {player.username}
            </h1>
            {ratings.length > 0 ? (
              <p className="mt-1 text-sm text-ink-muted">{ratings.join(" · ")}</p>
            ) : null}
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-ink-muted">
          {copy.lede}
          {player.banned ? ` ${copy.bannedNote}` : ""}
        </p>
        <p className="mt-3">
          <a
            href={player.chesscomUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
          >
            {copy.chesscom}
          </a>
        </p>
      </header>

      <section aria-labelledby="season-stats-heading" className="mb-10">
        <h2
          id="season-stats-heading"
          className="font-display text-xl font-semibold tracking-tight sm:text-2xl"
        >
          {copy.season}
        </h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          <Stat
            label={copy.rank}
            value={
              player.banned
                ? dict.prodige.banned
                : player.rank != null
                  ? String(player.rank)
                  : "—"
            }
          />
          <Stat label={copy.points} value={formatPoints(player.points)} />
          <Stat label={copy.arenas} value={String(player.arenas.length)} />
          <Stat label={copy.games} value={String(player.gamesPlayed)} />
          <Stat label={copy.wins} value={String(player.wins)} />
          <Stat label={copy.draws} value={String(player.draws)} />
          <Stat label={copy.losses} value={String(player.losses)} />
        </ul>
      </section>

      <div className="space-y-10">
        {player.arenas.map((arena) => {
          const dateLabel = formatArenaDate(arena.date, locale)
          return (
          <section key={arena.day} aria-labelledby={`arena-${arena.day}-heading`}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-wood">
                  {fill(arenaCopy.day, {
                    day: String(arena.day).padStart(2, "0"),
                  })}
                  {dateLabel ? ` · ${dateLabel}` : ""}
                </p>
                <h2
                  id={`arena-${arena.day}-heading`}
                  className="font-display mt-1 text-xl font-semibold tracking-tight sm:text-2xl"
                >
                  <LocaleLink
                    to="/prodige-league/arena/$day"
                    params={{ day: String(arena.day) }}
                    className="underline decoration-transparent underline-offset-2 hover:text-brand hover:decoration-brand"
                  >
                    {arena.name}
                  </LocaleLink>
                </h2>
              </div>
              <p className="text-sm tabular-nums text-ink-muted">
                {arena.place != null ? placeLabel(arena.place, locale) : "—"}
                {" · "}
                {fill(dict.prodige.pointsShort, {
                  points: formatPoints(arena.points),
                })}
                {" · "}
                {fill(copy.record, {
                  wins: arena.wins,
                  draws: arena.draws,
                  losses: arena.losses,
                })}
              </p>
            </div>

            {arena.games.length === 0 ? (
              <p className="mt-4 text-sm text-ink-muted">{arenaCopy.noGames}</p>
            ) : (
              <ol className="mt-4 divide-y divide-border border-y border-border">
                {arena.games.map((game, index) => (
                  <li
                    key={game.url}
                    className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:gap-4"
                  >
                    <span className="w-8 shrink-0 font-mono text-xs tabular-nums text-ink-muted">
                      {index + 1}
                    </span>
                    <p className="min-w-0 flex-1 text-sm leading-6">
                      <span className={`font-medium ${resultClass(game.result)}`}>
                        {resultLabel(game.result)}
                      </span>
                      <span className="mx-2 font-semibold tabular-nums">
                        {game.score}
                      </span>
                      <span className="text-ink-muted">
                        {game.color === "white" ? copy.white : copy.black}
                        {game.rating != null ? ` (${game.rating})` : ""}
                        {copy.against}
                      </span>
                      <LocaleLink
                        to="/prodige-league/player/$username"
                        params={{ username: game.opponent }}
                        className="font-medium text-foreground underline decoration-transparent underline-offset-2 hover:text-brand hover:decoration-brand"
                      >
                        {game.opponent}
                      </LocaleLink>
                      {game.opponentRating != null ? (
                        <span className="text-ink-muted">
                          {` (${game.opponentRating})`}
                        </span>
                      ) : null}
                      {game.timeLabel ? (
                        <span className="ml-2 text-ink-muted">{game.timeLabel}</span>
                      ) : null}
                    </p>
                    <a
                      href={game.url}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 text-sm font-medium text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
                    >
                      {arenaCopy.viewGame}
                    </a>
                  </li>
                ))}
              </ol>
            )}
          </section>
          )
        })}
      </div>
    </PageShell>
  )
}
