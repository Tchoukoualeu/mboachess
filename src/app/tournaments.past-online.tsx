import { createFileRoute } from "@tanstack/react-router"
import { useState, useEffect } from "react"
import { LocaleLink } from "@/components/LocaleLink"
import { PageShell } from "@/components/PageShell"
import { fill, getDictionary, useDictionary, useLocale, useRouteLoaderData, type Locale } from "@/lib/i18n"
import { loadPastOnlineTournaments } from "@/server/tournaments"
import { pageHead, webPageJsonLd } from "@/lib/seo"
import { formatDate, getUserTimezone } from "@/lib/utils"

export function pastTournamentsHead(locale: Locale) {
  const copy = getDictionary(locale).tournaments
  return pageHead({
    title: copy.pastMetaTitle,
    description: copy.pastMetaDescription,
    path: "/tournaments/past-online",
    locale,
    jsonLd: webPageJsonLd({
      title: copy.pastMetaTitle,
      description: copy.pastMetaDescription,
      path: "/tournaments/past-online",
      locale,
    }),
  })
}

export const Route = createFileRoute("/tournaments/past-online")({
  head: () => pastTournamentsHead("fr"),
  loader: () => loadPastOnlineTournaments(),
  component: PastOnlineTournamentsPage,
})

export function PastOnlineTournamentsPage() {
  const copy = useDictionary().tournaments
  const locale = useLocale()
  const tournaments = useRouteLoaderData<Awaited<ReturnType<typeof loadPastOnlineTournaments>>>()
  const [userTimezone, setUserTimezone] = useState<string>("UTC")

  useEffect(() => {
    setUserTimezone(getUserTimezone())
  }, [])

  return (
    <PageShell>
      <header className="mb-6 sm:mb-8">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
          {copy.pastTitle}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
          {copy.pastLede}{" "}
          <LocaleLink
            to="/tournaments"
            className="text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
          >
            {copy.upcomingLink}
          </LocaleLink>
          .
        </p>
      </header>

      {tournaments.length === 0 ? (
        <p className="py-10 text-center text-ink-muted">
          {copy.pastEmpty}
        </p>
      ) : (
        <section aria-labelledby="past-heading" className="space-y-4">
          <h2 id="past-heading" className="text-sm font-medium text-ink-muted">
            {fill(copy.pastCount, { count: tournaments.length })}
          </h2>
          {tournaments.map((tournament) => (
            <article
              key={tournament.id}
              className="rounded-xl border border-border bg-surface p-4 sm:p-6"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold text-foreground">
                  {tournament.name}
                </h3>
                <span className="inline-flex items-center rounded-md bg-brand-muted px-2.5 py-0.5 text-xs font-medium text-brand">
                  {copy.online}
                </span>
                <span className="inline-flex items-center rounded-md bg-surface-muted px-2.5 py-0.5 text-xs font-medium text-ink-muted">
                  {copy.past}
                </span>
              </div>
              {tournament.description && (
                <p className="mt-1 whitespace-pre-line text-sm text-ink-muted">
                  {tournament.description}
                </p>
              )}
              {tournament.winners.length > 0 ? (
                <p className="mt-2 text-sm text-wood">
                  <span className="font-medium">
                    {tournament.winners.length === 1 ? copy.winner : copy.winners}:
                  </span>{" "}
                  {tournament.winners.map((username, index) => (
                    <span key={username}>
                      {index > 0 ? ", " : null}
                      <a
                        href={`https://www.chess.com/member/${encodeURIComponent(username)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
                      >
                        {username}
                      </a>
                    </span>
                  ))}
                  {tournament.winnersSource === "chesscom" ? (
                    <span className="ml-1 text-xs text-ink-muted">
                      (Chess.com)
                    </span>
                  ) : null}
                </p>
              ) : tournament.link ? (
                <p className="mt-2 text-xs text-ink-muted">
                  {copy.winnerMissing}
                </p>
              ) : null}
              <div className="mt-3 space-y-1.5 text-sm text-foreground/90">
                <div>
                  {copy.started}{" "}
                  <span className="font-medium">
                    {formatDate(tournament.startDate, userTimezone, locale)}
                  </span>
                </div>
                {tournament.endDate && (
                  <div>
                    {copy.ended}{" "}
                    <span className="font-medium">
                      {formatDate(tournament.endDate, userTimezone, locale)}
                    </span>
                  </div>
                )}
                {tournament.link && (
                  <a
                    href={tournament.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
                  >
                    {copy.link}
                  </a>
                )}
              </div>
            </article>
          ))}
        </section>
      )}
    </PageShell>
  )
}
