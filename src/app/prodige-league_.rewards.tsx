import { createFileRoute } from "@tanstack/react-router"
import { LocaleLink } from "@/components/LocaleLink"
import { PageShell } from "@/components/PageShell"
import {
  fill,
  getDictionary,
  useDictionary,
  useRouteLoaderData,
  type Locale,
} from "@/lib/i18n"
import type { ProdigeRewardId } from "@/lib/prodigeRewards"
import { pageHead } from "@/lib/seo"
import {
  loadProdigeRewardsPage,
  type ProdigeRewardRowView,
  type ProdigeRewardsPage,
} from "@/server/prodigeRewards"

const PATH = "/prodige-league/rewards"

export function rewardsHead(locale: Locale) {
  const copy = getDictionary(locale).prodigeRewards
  return pageHead({
    title: copy.metaTitle,
    description: copy.metaDescription,
    path: PATH,
    locale,
  })
}

export const Route = createFileRoute("/prodige-league_/rewards")({
  head: () => rewardsHead("fr"),
  loader: () => loadProdigeRewardsPage(),
  component: ProdigeRewardsPageView,
})

function statLine(
  id: ProdigeRewardId,
  row: ProdigeRewardRowView,
  copy: ReturnType<typeof getDictionary>["prodigeRewards"],
  arenaCount: number,
): string {
  if (id === "attendance") {
    return fill(copy.stats.attendance, { count: arenaCount })
  }
  return fill(copy.stats[id], {
    primary: row.primary,
    secondary: row.secondary ?? 0,
  })
}

function PlayerMark({ row }: { row: ProdigeRewardRowView }) {
  return (
    <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border bg-surface-muted">
      {row.avatarUrl ? (
        <img
          src={row.avatarUrl}
          alt=""
          width={36}
          height={36}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-ink-muted">
          {row.username.slice(0, 1).toUpperCase()}
        </span>
      )}
    </div>
  )
}

export function ProdigeRewardsPageView() {
  const dict = useDictionary()
  const copy = dict.prodigeRewards
  const arenaCopy = dict.prodigeArena
  const board = useRouteLoaderData<ProdigeRewardsPage>()
  const leaders = (rows: ProdigeRewardRowView[]) =>
    rows.filter((row) => row.leader).length
  const hasFollowers = (rows: ProdigeRewardRowView[]) =>
    rows.some((row) => !row.leader)

  return (
    <PageShell>
      <header className="mb-10">
        <p className="mb-4">
          <LocaleLink
            to="/prodige-league"
            activeOptions={{ exact: true }}
            className="text-sm text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
          >
            {arenaCopy.back}
          </LocaleLink>
        </p>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-wood">
          {copy.kicker}
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          {copy.title}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-foreground">
          {copy.lede}
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-muted">
          {fill(copy.update, {
            arenas: board.arenaCount,
            games: board.gameCount,
          })}
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-muted">
          {copy.bannedNote}
        </p>
      </header>

      <div className="space-y-10">
        {board.rewards.map((reward) => {
          const detail = copy.rewards[reward.id]
          const shared = leaders(reward.rows)
          return (
            <section key={reward.id} aria-labelledby={`${reward.id}-heading`}>
              <h2
                id={`${reward.id}-heading`}
                className="font-display text-xl font-semibold tracking-tight sm:text-2xl"
              >
                {detail.title}
              </h2>
              {detail.body.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-2 max-w-2xl text-sm leading-6 text-foreground"
                >
                  {paragraph}
                </p>
              ))}
              <ul className="mt-3 max-w-2xl list-disc space-y-1 pl-5 text-sm leading-6 text-ink-muted">
                {detail.rules.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>

              {reward.rows.length === 0 ? (
                <p className="mt-4 rounded-xl border border-dashed border-border bg-surface px-4 py-6 text-sm text-ink-muted">
                  {copy.empty}
                </p>
              ) : (
                <>
                  {shared > 1 ? (
                    <p className="mt-4 text-sm font-medium text-wood">
                      {fill(copy.shared, { count: shared })}
                    </p>
                  ) : null}
                  {reward.id === "giantKiller" && hasFollowers(reward.rows) ? (
                    <p
                      className={`text-sm text-ink-muted ${shared > 1 ? "mt-2" : "mt-4"}`}
                    >
                      {copy.nextUpsets}
                    </p>
                  ) : null}
                  <ol
                    className={`${shared > 1 || hasFollowers(reward.rows) ? "mt-3" : "mt-4"} overflow-hidden rounded-xl border border-border bg-surface`}
                  >
                    {reward.rows.map((row, index) => (
                      <li
                        key={`${row.username}-${row.game?.url ?? index}`}
                        className={`border-b border-border last:border-b-0 ${
                          row.leader ? "bg-brand-muted/50" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3 px-3 py-3 sm:px-4">
                          <LocaleLink
                            to="/prodige-league/player/$username"
                            params={{ username: row.username }}
                            className="group flex min-w-0 flex-1 items-start gap-3"
                          >
                            <PlayerMark row={row} />
                            <span className="min-w-0">
                              <span className="flex flex-wrap items-center gap-2">
                                <span className="truncate font-medium text-foreground group-hover:text-brand">
                                  {row.username}
                                </span>
                                {row.leader ? (
                                  <span className="rounded-full bg-[#e0b45a] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#1a1408]">
                                    {copy.holder}
                                  </span>
                                ) : null}
                              </span>
                              <span className="mt-0.5 block text-sm tabular-nums text-ink-muted">
                                {statLine(
                                  reward.id,
                                  row,
                                  copy,
                                  board.arenaCount,
                                )}
                              </span>
                            </span>
                          </LocaleLink>
                        </div>
                        {row.game ? (
                          <p className="px-3 pb-3 text-sm leading-6 text-ink-muted sm:px-4">
                            {fill(copy.gameLine, {
                              winner: row.game.winner,
                              winnerRating: row.game.winnerRating,
                              color: copy[row.game.color],
                              loser: row.game.loser,
                              loserRating: row.game.loserRating,
                              finish: copy.finish[row.game.finish],
                            })}{" "}
                            <a
                              href={row.game.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
                            >
                              {arenaCopy.viewGame}
                            </a>
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ol>
                </>
              )}
            </section>
          )
        })}
      </div>
    </PageShell>
  )
}
