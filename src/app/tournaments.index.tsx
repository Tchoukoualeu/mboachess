import { createFileRoute, Link } from "@tanstack/react-router"
import { AddTournamentForm } from "@/components/AddTournamentForm"
import { loadTournaments } from "@/server/tournaments"
import { pageHead } from "@/lib/seo"

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function getDaysUntil(date: Date): number {
  const now = new Date()
  const diff = new Date(date).getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export const Route = createFileRoute("/tournaments/")({
  head: () =>
    pageHead({
      title: "Chess Tournaments in Cameroon | mboachess",
      description:
        "View and add upcoming chess tournaments in Cameroon. Find local and online events for players of all levels.",
      path: "/tournaments",
    }),
  loader: () => loadTournaments(),
  component: TournamentsPage,
})

function TournamentsPage() {
  const tournaments = Route.useLoaderData()

  return (
    <div className="min-h-dvh flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-5 sm:px-6 sm:py-8">
        <header className="mb-4 sm:mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl">
              Tournaments
            </h1>
            <Link
              to="/"
              className="text-sm text-emerald-700 underline decoration-emerald-700/30 underline-offset-2 hover:decoration-emerald-600 dark:text-emerald-400 dark:decoration-emerald-400/40"
            >
              Back to Home
            </Link>
          </div>
          <p className="max-w-2xl text-xs leading-5 text-zinc-600 sm:text-sm sm:leading-6 dark:text-zinc-400">
            Upcoming chess tournaments. Add your tournament to share it with the
            community.
          </p>
        </header>

        <AddTournamentForm />

        {tournaments.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
            <p className="text-zinc-600 dark:text-zinc-400">
              No upcoming tournaments yet. Be the first to add one!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Upcoming Tournaments ({tournaments.length})
            </div>
            {tournaments.map((tournament) => {
              const daysUntil = getDaysUntil(tournament.startDate)
              return (
                <Link
                  key={tournament.id}
                  to="/tournaments/$id"
                  params={{ id: tournament.id }}
                  className="block rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-6"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                          {tournament.name}
                        </h3>
                        {tournament.isOnline && (
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
                        )}
                      </div>
                      {tournament.description && (
                        <p className="mt-1 whitespace-pre-line text-sm text-zinc-600 dark:text-zinc-400">
                          {tournament.description}
                        </p>
                      )}
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
                            Starts:{" "}
                            <span className="font-medium">
                              {formatDate(tournament.startDate)}
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
                              Ends:{" "}
                              <span className="font-medium">
                                {formatDate(tournament.endDate)}
                              </span>
                            </span>
                          </div>
                        )}
                        {tournament.location && (
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
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <span>{tournament.location}</span>
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
                        {tournament.phone && (
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
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                            <a
                              href={`tel:${tournament.phone.split("/")[0].trim()}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-emerald-700 hover:underline dark:text-emerald-400"
                            >
                              {tournament.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-start gap-1 rounded-lg bg-emerald-50 px-3 py-2 dark:bg-emerald-900/20 sm:items-end">
                      <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                        {daysUntil}
                      </div>
                      <div className="text-xs font-medium uppercase text-emerald-700 dark:text-emerald-400">
                        {daysUntil === 1 ? "day left" : "days left"}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
