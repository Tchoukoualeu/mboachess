import { createFileRoute } from "@tanstack/react-router"
import { useState, useEffect } from "react"
import { AddTournamentForm } from "@/components/AddTournamentForm"
import { LocaleLink } from "@/components/LocaleLink"
import { PageShell } from "@/components/PageShell"
import { fill, getDictionary, useDictionary, useLocale, useRouteLoaderData, type Locale } from "@/lib/i18n"
import { loadTournaments } from "@/server/tournaments"
import { pageHead, webPageJsonLd } from "@/lib/seo"
import { formatDate, getUserTimezone } from "@/lib/utils"

function getDaysUntil(date: Date): number {
  const now = new Date()
  const diff = new Date(date).getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function tournamentsHead(locale: Locale) {
  const copy = getDictionary(locale).tournaments
  return pageHead({
    title: copy.metaTitle,
    description: copy.metaDescription,
    path: "/tournaments",
    locale,
    jsonLd: webPageJsonLd({
      title: copy.metaTitle,
      description: copy.metaDescription,
      path: "/tournaments",
      locale,
    }),
  })
}

export const Route = createFileRoute("/tournaments/")({
  head: () => tournamentsHead("fr"),
  loader: () => loadTournaments(),
  component: TournamentsPage,
})

export function TournamentsPage() {
  const dict = useDictionary()
  const copy = dict.tournaments
  const locale = useLocale()
  const tournaments = useRouteLoaderData<Awaited<ReturnType<typeof loadTournaments>>>()
  const [userTimezone, setUserTimezone] = useState<string>("UTC")

  useEffect(() => {
    setUserTimezone(getUserTimezone())
  }, [])

  return (
    <PageShell>
      <header className="mb-6 sm:mb-8">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
          {copy.title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
          {copy.lede}{" "}
          <LocaleLink
            to="/tournaments/past-online"
            className="text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
          >
            {copy.pastLink}
          </LocaleLink>
          .
        </p>
      </header>

      <LocaleLink
        to="/prodige-league"
        className="mb-6 block rounded-xl border border-wood/40 bg-surface px-4 py-4 transition hover:border-wood sm:px-5"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-wood">
          {copy.prodigeKicker}
        </p>
        <p className="mt-1 font-display text-lg font-semibold tracking-tight text-foreground">
          {copy.prodigeTitle}
        </p>
        <p className="mt-1 text-sm text-ink-muted">{copy.prodigeLede}</p>
      </LocaleLink>

      <AddTournamentForm />

      {tournaments.length === 0 ? (
        <p className="py-10 text-center text-ink-muted">
          {copy.empty}
        </p>
      ) : (
        <section aria-labelledby="upcoming-heading" className="space-y-4">
          <h2
            id="upcoming-heading"
            className="text-sm font-medium text-ink-muted"
          >
            {fill(copy.upcoming, { count: tournaments.length })}
          </h2>
          {tournaments.map((tournament) => {
            const daysUntil = getDaysUntil(tournament.startDate)
            return (
              <LocaleLink
                key={tournament.id}
                to="/tournaments/$id"
                params={{ id: tournament.id }}
                className="block rounded-xl border border-border bg-surface p-4 transition hover:border-brand/40 sm:p-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {tournament.name}
                      </h3>
                      {tournament.isOnline && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-brand-muted px-2.5 py-0.5 text-xs font-medium text-brand">
                          {copy.online}
                        </span>
                      )}
                    </div>
                    {tournament.description && (
                      <p className="mt-1 whitespace-pre-line text-sm text-ink-muted">
                        {tournament.description}
                      </p>
                    )}
                    <div className="mt-3 space-y-1.5 text-sm text-foreground/90">
                      <div>
                        {copy.starts}{" "}
                        <span className="font-medium">
                          {formatDate(tournament.startDate, userTimezone, locale)}
                        </span>
                      </div>
                      {tournament.endDate && (
                        <div>
                          {copy.ends}{" "}
                          <span className="font-medium">
                            {formatDate(tournament.endDate, userTimezone, locale)}
                          </span>
                        </div>
                      )}
                      {tournament.location && (
                        <div>{tournament.location}</div>
                      )}
                      {tournament.link && (
                        <a
                          href={tournament.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
                        >
                          {copy.link}
                        </a>
                      )}
                      {tournament.phone && (
                        <div>
                          <a
                            href={`tel:${tournament.phone.split("/")[0].trim()}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-brand hover:underline"
                          >
                            {tournament.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-start gap-1 rounded-lg bg-brand-muted px-3 py-2 sm:items-end">
                    <div className="text-2xl font-bold text-brand">
                      {daysUntil}
                    </div>
                    <div className="text-xs font-medium uppercase text-brand">
                      {daysUntil === 1 ? copy.dayLeft : copy.daysLeft}
                    </div>
                  </div>
                </div>
              </LocaleLink>
            )
          })}
        </section>
      )}
    </PageShell>
  )
}
