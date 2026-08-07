import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"
import { AddTournamentForm } from "@/components/AddTournamentForm"
import { PageShell } from "@/components/PageShell"
import { loadTournaments } from "@/server/tournaments"
import { pageHead, webPageJsonLd } from "@/lib/seo"
import { formatDate, getUserTimezone } from "@/lib/utils"

function getDaysUntil(date: Date): number {
  const now = new Date()
  const diff = new Date(date).getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

const TITLE = "Chess Tournaments in Cameroon | mboachess"
const DESCRIPTION =
  "View and add upcoming chess tournaments in Cameroon. Find local and online events for players of all levels."

export const Route = createFileRoute("/tournaments/")({
  head: () =>
    pageHead({
      title: TITLE,
      description: DESCRIPTION,
      path: "/tournaments",
      jsonLd: webPageJsonLd({
        title: TITLE,
        description: DESCRIPTION,
        path: "/tournaments",
      }),
    }),
  loader: () => loadTournaments(),
  component: TournamentsPage,
})

function TournamentsPage() {
  const tournaments = Route.useLoaderData()
  const [userTimezone, setUserTimezone] = useState<string>("UTC")

  useEffect(() => {
    setUserTimezone(getUserTimezone())
  }, [])

  return (
    <PageShell>
      <header className="mb-6 sm:mb-8">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
          Tournaments
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
          Upcoming chess tournaments. Add yours to share it with the community.{" "}
          <Link
            to="/tournaments/past-online"
            className="text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
          >
            View past online tournaments
          </Link>
          .
        </p>
      </header>

      <AddTournamentForm />

      {tournaments.length === 0 ? (
        <p className="py-10 text-center text-ink-muted">
          No upcoming tournaments yet. Be the first to add one!
        </p>
      ) : (
        <section aria-labelledby="upcoming-heading" className="space-y-4">
          <h2
            id="upcoming-heading"
            className="text-sm font-medium text-ink-muted"
          >
            Upcoming ({tournaments.length})
          </h2>
          {tournaments.map((tournament) => {
            const daysUntil = getDaysUntil(tournament.startDate)
            return (
              <Link
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
                          Online
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
                        Starts:{" "}
                        <span className="font-medium">
                          {formatDate(tournament.startDate, userTimezone)}
                        </span>
                      </div>
                      {tournament.endDate && (
                        <div>
                          Ends:{" "}
                          <span className="font-medium">
                            {formatDate(tournament.endDate, userTimezone)}
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
                          Tournament link
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
                      {daysUntil === 1 ? "day left" : "days left"}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </section>
      )}
    </PageShell>
  )
}
