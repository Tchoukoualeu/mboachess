import { createFileRoute, Link, notFound } from "@tanstack/react-router"
import { PageShell } from "@/components/PageShell"
import { pageHead } from "@/lib/seo"
import type { ProdigeArenaView } from "@/lib/prodigeArenaSchedule"
import { loadProdigeArena } from "@/server/prodigeArenas"

function formatPoints(points: number): string {
  return Number.isInteger(points) ? String(points) : points.toFixed(1)
}

export const Route = createFileRoute("/prodige-league_/arena/$day")({
  head: ({ loaderData, params }) => {
    const arena = loaderData as ProdigeArenaView | undefined
    const day = arena?.day ?? params.day
    const title = `Arène ${day} · Prodige League | mboachess`
    const description = arena
      ? `Classement et parties de l'arène ${arena.day} de la Prodige League (${arena.dateLabel}).`
      : "Classement et parties d'une arène de la Prodige League."
    return pageHead({
      title,
      description,
      path: `/prodige-league/arena/${params.day}`,
    })
  },
  loader: async ({ params }): Promise<ProdigeArenaView> => {
    const arena = await loadProdigeArena({ data: params.day })
    if (!arena) throw notFound()
    return arena
  },
  component: ProdigeArenaPage,
})

function ProdigeArenaPage() {
  const arena = Route.useLoaderData() as ProdigeArenaView

  return (
    <PageShell>
      <header className="mb-8">
        <p className="mb-2">
          <Link
            to="/prodige-league"
            className="text-sm text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
          >
            ← Prodige League
          </Link>
        </p>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-wood">
          Jour {arena.day}
          {arena.dateLabel !== "Date à définir" ? ` · ${arena.dateLabel}` : ""}
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          {arena.name}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
          {arena.statusLabel}
          {arena.whenLabel ? ` · ${arena.whenLabel}` : ""} · {arena.players.length}{" "}
          joueurs · {arena.games.length} parties. Points et liens des parties
          viennent de Chess.com et sont enregistrés sur mboachess.
        </p>
        <p className="mt-3">
          <a
            href={arena.chesscomUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
          >
            Voir l'arène sur Chess.com
          </a>
        </p>
      </header>

      {arena.notice ? (
        <p className="mb-6 rounded-xl border border-wood/40 bg-wood/10 px-4 py-3 text-sm text-foreground">
          {arena.notice}
        </p>
      ) : null}
      {arena.error ? (
        <p className="mb-6 rounded-xl border border-border bg-surface-muted px-4 py-3 text-sm text-foreground">
          {arena.error}
        </p>
      ) : null}

      <section aria-labelledby="standings-heading" className="mb-10">
        <h2
          id="standings-heading"
          className="font-display text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Classement
        </h2>
        {arena.players.length === 0 ? (
          <p className="mt-4 text-sm text-ink-muted">
            Aucun classement enregistré pour cette arène.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="bg-surface-muted text-xs uppercase tracking-wide text-ink-muted">
                <tr>
                  <th className="px-3 py-2 font-medium">#</th>
                  <th className="px-3 py-2 font-medium">Joueur</th>
                  <th className="px-3 py-2 text-right font-medium">Points</th>
                  <th className="px-3 py-2 text-right font-medium">V</th>
                  <th className="px-3 py-2 text-right font-medium">N</th>
                  <th className="px-3 py-2 text-right font-medium">D</th>
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
          V victoires, N nulles, D défaites, d'après les parties de l'arène.
        </p>
      </section>

      <section aria-labelledby="games-heading">
        <h2
          id="games-heading"
          className="font-display text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Parties
        </h2>
        {arena.games.length === 0 ? (
          <p className="mt-4 text-sm text-ink-muted">
            Aucune partie enregistrée pour cette arène.
          </p>
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
                  Voir la partie
                </a>
              </li>
            ))}
          </ol>
        )}
      </section>
    </PageShell>
  )
}
