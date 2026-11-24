import { createFileRoute, notFound } from "@tanstack/react-router"
import { LocaleLink } from "@/components/LocaleLink"
import { PageShell } from "@/components/PageShell"
import { fill, formatClock, formatWhen, getDictionary, useDictionary, useLocale, useRouteLoaderData, type Locale } from "@/lib/i18n"
import { pageHead } from "@/lib/seo"
import { formatArenaDate, type ProdigeArenaView } from "@/lib/prodigeArenaSchedule"
import { loadProdigeArena } from "@/server/prodigeArenas"

function formatPoints(points: number): string {
  return Number.isInteger(points) ? String(points) : points.toFixed(1)
}

export function arenaHead(locale: Locale, loaderData: unknown, day: string) {
  const copy = getDictionary(locale).prodigeArena
  const arena = loaderData as ProdigeArenaView | undefined
  const dayLabel = String(arena?.day ?? day)
  const date = arena
    ? formatArenaDate(arena.date, locale) || copy.datePending
    : ""
  return pageHead({
    title: fill(copy.metaTitle, { day: dayLabel }),
    description: arena
      ? fill(copy.metaDescription, { day: dayLabel, date })
      : copy.metaDescriptionFallback,
    path: `/prodige-league/arena/${day}`,
    locale,
  })
}

export const Route = createFileRoute("/prodige-league_/arena/$day")({
  head: ({ loaderData, params }) => arenaHead("fr", loaderData, params.day),
  loader: async ({ params }): Promise<ProdigeArenaView> => {
    const arena = await loadProdigeArena({ data: params.day })
    if (!arena) throw notFound()
    return arena
  },
  component: ProdigeArenaPage,
})

export function ProdigeArenaPage() {
  const copy = useDictionary().prodigeArena
  const locale = useLocale()
  const arena = useRouteLoaderData<ProdigeArenaView>()
  const dateLabel = formatArenaDate(arena.date, locale) || copy.datePending
  const when = formatWhen(arena.startTime, locale)
  const status =
    arena.status === "finished"
      ? copy.status.finished
      : arena.status === "in_progress"
        ? copy.status.inProgress
        : arena.status === "registration"
          ? copy.status.registration
          : copy.status.results
  const notice = arena.noticeCode ? copy[arena.noticeCode] : arena.notice
  const error = arena.errorCode ? copy[arena.errorCode] : arena.error

  return (
    <PageShell>
      <header className="mb-8">
        <p className="mb-2">
          <LocaleLink
            to="/prodige-league"
            className="text-sm text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
          >
            {copy.back}
          </LocaleLink>
        </p>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-wood">
          {fill(copy.day, { day: arena.day })}
          {arena.date ? ` · ${dateLabel}` : ""}
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          {arena.name}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
          {fill(copy.summary, {
            status,
            when: when ? fill(copy.whenJoin, { when }) : "",
            players: arena.players.length,
            games: arena.games.length,
          })}
        </p>
        <p className="mt-3">
          <a
            href={arena.chesscomUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
          >
            {copy.chesscom}
          </a>
        </p>
      </header>

      {notice ? (
        <p className="mb-6 rounded-xl border border-wood/40 bg-wood/10 px-4 py-3 text-sm text-foreground">
          {notice}
        </p>
      ) : null}
      {error ? (
        <p className="mb-6 rounded-xl border border-border bg-surface-muted px-4 py-3 text-sm text-foreground">
          {error}
        </p>
      ) : null}

      <section aria-labelledby="standings-heading" className="mb-10">
        <h2
          id="standings-heading"
          className="font-display text-xl font-semibold tracking-tight sm:text-2xl"
        >
          {copy.standings}
        </h2>
        {arena.players.length === 0 ? (
          <p className="mt-4 text-sm text-ink-muted">{copy.noStandings}</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="bg-surface-muted text-xs uppercase tracking-wide text-ink-muted">
                <tr>
                  <th className="px-3 py-2 font-medium">#</th>
                  <th className="px-3 py-2 font-medium">{copy.player}</th>
                  <th className="px-3 py-2 text-right font-medium">{copy.points}</th>
                  <th className="px-3 py-2 text-right font-medium">{copy.wins}</th>
                  <th className="px-3 py-2 text-right font-medium">{copy.draws}</th>
                  <th className="px-3 py-2 text-right font-medium">{copy.losses}</th>
                </tr>
              </thead>
              <tbody>
                {arena.players.map((player) => (
                  <tr
                    key={player.username}
                    className="border-t border-border"
                  >
                    <td className="px-3 py-2.5 font-mono tabular-nums text-ink-muted">
                      {player.place}
                    </td>
                    <td className="px-3 py-2.5">
                      <a
                        href={player.profileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-foreground underline decoration-transparent underline-offset-2 hover:text-brand hover:decoration-brand"
                      >
                        {player.username}
                      </a>
                    </td>
                    <td className="px-3 py-2.5 text-right font-semibold tabular-nums">
                      {formatPoints(player.points)}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-ink-muted">
                      {player.wins}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-ink-muted">
                      {player.draws}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-ink-muted">
                      {player.losses}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-2 text-xs text-ink-muted">
          {copy.legend}
        </p>
      </section>

      <section aria-labelledby="games-heading">
        <h2
          id="games-heading"
          className="font-display text-xl font-semibold tracking-tight sm:text-2xl"
        >
          {copy.games}
        </h2>
        {arena.games.length === 0 ? (
          <p className="mt-4 text-sm text-ink-muted">{copy.noGames}</p>
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
                  <span className="font-medium">{game.white}</span>
                  {game.whiteRating != null ? (
                    <span className="text-ink-muted"> ({game.whiteRating})</span>
                  ) : null}
                  <span className="mx-2 font-semibold tabular-nums">
                    {game.score}
                  </span>
                  <span className="font-medium">{game.black}</span>
                  {game.blackRating != null ? (
                    <span className="text-ink-muted"> ({game.blackRating})</span>
                  ) : null}
                  {formatClock(game.endTime, locale) ? (
                    <span className="ml-2 text-ink-muted">
                      {formatClock(game.endTime, locale)}
                    </span>
                  ) : null}
                </p>
                <a
                  href={game.url}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 text-sm font-medium text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
                >
                  {copy.viewGame}
                </a>
              </li>
            ))}
          </ol>
        )}
      </section>
    </PageShell>
  )
}
