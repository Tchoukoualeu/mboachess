import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"
import { loadPastOnlineTournaments } from "@/server/tournaments"
import { pageHead } from "@/lib/seo"
import { formatDate, getUserTimezone } from "@/lib/utils"

export const Route = createFileRoute("/tournaments/past-online")({
  head: () =>
    pageHead({
      title: "Past Online Chess Tournaments | mboachess",
      description:
        "Browse past online chess tournaments. Relive previous online events from the mboachess community.",
      path: "/tournaments/past-online",
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
    <div className="min-h-dvh flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-5 sm:px-6 sm:py-8">
        <header className="mb-4 sm:mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl">
              Past Online Tournaments
            </h1>
            <Link
              to="/"
              className="text-sm text-emerald-700 underline decoration-emerald-700/30 underline-offset-2 hover:decoration-emerald-600 dark:text-emerald-400 dark:decoration-emerald-400/40"
            >
              Back to Home
            </Link>
          </div>
          <p className="max-w-2xl text-xs leading-5 text-zinc-600 sm:text-sm sm:leading-6 dark:text-zinc-400">
            Online chess tournaments that have already taken place. Winners are
            fetched from Chess.com when the tournament link points to a
            Chess.com event. Looking for upcoming events?{" "}
            <Link
              to="/tournaments"
              className="text-emerald-700 underline decoration-emerald-700/30 underline-offset-2 hover:decoration-emerald-600 dark:text-emerald-400 dark:decoration-emerald-400/40"
            >
              View upcoming tournaments
            </Link>
            .
          </p>
        </header>

        {tournaments.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
            <p className="text-zinc-600 dark:text-zinc-400">
              No past online tournaments yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Past Online Tournaments ({tournaments.length})
            </div>
            {tournaments.map((tournament) => (
              <div
                key={tournament.id}
                className="block rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                        {tournament.name}
                      </h3>
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                          />
                        </svg>
                        Online
                      </span>
                      <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                        Past
                      </span>
                    </div>
                    {tournament.description && (
                      <p className="mt-1 whitespace-pre-line text-sm text-zinc-600 dark:text-zinc-400">
                        {tournament.description}
                      </p>
                    )}
                    {tournament.winners.length > 0 ? (
                      <p className="mt-2 text-sm text-amber-800 dark:text-amber-200/90">
                        <span className="font-medium">
                          {tournament.winners.length === 1
                            ? "Winner"
                            : "Winners"}
                          :
                        </span>{" "}
                        {tournament.winners.map((username, index) => (
                          <span key={username}>
                            {index > 0 ? ", " : null}
                            <a
                              href={`https://www.chess.com/member/${encodeURIComponent(username)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="font-semibold text-emerald-700 underline decoration-emerald-700/30 underline-offset-2 hover:decoration-emerald-600 dark:text-emerald-400 dark:decoration-emerald-400/40"
                            >
                              {username}
                            </a>
                          </span>
                        ))}
                        {tournament.winnersSource === "chesscom" ? (
                          <span className="ml-1 text-xs text-zinc-500 dark:text-zinc-400">
                            (Chess.com)
                          </span>
                        ) : null}
                      </p>
                    ) : tournament.link ? (
                      <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                        Winner not available from Chess.com yet
                      </p>
                    ) : null}
                    <div className="mt-3 space-y-1.5 text-sm">
                      <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                        <svg
                          className="h-4 w-4 text-zinc-500 dark:text-zinc-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>
                          Started:{" "}
                          <span className="font-medium">
                            {formatDate(tournament.startDate, userTimezone)}
                          </span>
                        </span>
                      </div>
                      {tournament.endDate && (
                        <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                          <svg
                            className="h-4 w-4 text-zinc-500 dark:text-zinc-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>
                            Ended:{" "}
                            <span className="font-medium">
                              {formatDate(tournament.endDate, userTimezone)}
                            </span>
                          </span>
                        </div>
                      )}
                      {tournament.link && (
                        <div className="flex items-center gap-2">
                          <svg
                            className="h-4 w-4 text-zinc-500 dark:text-zinc-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                            />
                          </svg>
                          <a
                            href={tournament.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-emerald-700 underline decoration-emerald-700/30 underline-offset-2 hover:decoration-emerald-600 dark:text-emerald-400 dark:decoration-emerald-400/40"
                          >
                            Tournament Link
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
