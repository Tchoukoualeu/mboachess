import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"
import { PageShell } from "@/components/PageShell"
import { loadPastOnlineTournaments } from "@/server/tournaments"
import { pageHead, webPageJsonLd } from "@/lib/seo"
import { formatDate, getUserTimezone } from "@/lib/utils"

const TITLE = "Past Online Chess Tournaments | mboachess"
const DESCRIPTION =
  "Browse past online chess tournaments. Relive previous online events from the mboachess community."

export const Route = createFileRoute("/tournaments/past-online")({
  head: () =>
    pageHead({
      title: TITLE,
      description: DESCRIPTION,
      path: "/tournaments/past-online",
      jsonLd: webPageJsonLd({
        title: TITLE,
        description: DESCRIPTION,
        path: "/tournaments/past-online",
      }),
    }),
  loader: () => loadPastOnlineTournaments(),
  component: PastOnlineTournamentsPage,
})

function PastOnlineTournamentsPage() {
  const tournaments = Route.useLoaderData()
  const [userTimezone, setUserTimezone] = useState<string>("UTC")

  useEffect(() => {
    setUserTimezone(getUserTimezone())
  }, [])

  return (
    <PageShell>
      <header className="mb-6 sm:mb-8">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
          Past online tournaments
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
          Online events that have already taken place. Winners are fetched from
          Chess.com when the tournament link points to a Chess.com event.{" "}
          <Link
            to="/tournaments"
            className="text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
          >
            View upcoming tournaments
          </Link>
          .
        </p>
      </header>

      {tournaments.length === 0 ? (
        <p className="py-10 text-center text-ink-muted">
          No past online tournaments yet.
        </p>
      ) : (
        <section aria-labelledby="past-heading" className="space-y-4">
          <h2 id="past-heading" className="text-sm font-medium text-ink-muted">
            Past online ({tournaments.length})
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
                  Online
                </span>
                <span className="inline-flex items-center rounded-md bg-surface-muted px-2.5 py-0.5 text-xs font-medium text-ink-muted">
                  Past
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
                    {tournament.winners.length === 1 ? "Winner" : "Winners"}:
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
                  Winner not available from Chess.com yet
                </p>
              ) : null}
              <div className="mt-3 space-y-1.5 text-sm text-foreground/90">
                <div>
                  Started:{" "}
                  <span className="font-medium">
                    {formatDate(tournament.startDate, userTimezone)}
                  </span>
                </div>
                {tournament.endDate && (
                  <div>
                    Ended:{" "}
                    <span className="font-medium">
                      {formatDate(tournament.endDate, userTimezone)}
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
                    Tournament link
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
