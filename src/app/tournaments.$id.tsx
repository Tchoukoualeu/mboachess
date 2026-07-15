import { createFileRoute, Link, notFound } from "@tanstack/react-router"
import { loadTournamentById } from "@/server/tournaments"
import { pageHead } from "@/lib/seo"
import type { Tournament } from "@/lib/tournaments"

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

export const Route = createFileRoute("/tournaments/$id")({
  head: ({ params }) =>
    pageHead({
      title: "Tournament Details | mboachess",
      description: "View tournament information and details",
      path: `/tournaments/${params.id}`,
    }),
  loader: async ({ params }): Promise<Tournament> => {
    const tournament = await loadTournamentById({ data: params.id })
    if (!tournament) throw notFound()

    return tournament
  },
  component: TournamentDetailPage,
})

function TournamentDetailPage() {
  const tournament = Route.useLoaderData() as Tournament
  const daysUntil = getDaysUntil(tournament.startDate)

  return (
    <div className="min-h-dvh flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-5 sm:px-6 sm:py-8">
        <header className="mb-4 sm:mb-6">
          <div className="mb-3 flex items-center justify-between">
            <Link
              to="/tournaments"
              className="text-sm text-emerald-700 underline decoration-emerald-700/30 underline-offset-2 hover:decoration-emerald-600 dark:text-emerald-400 dark:decoration-emerald-400/40"
            >
              ← Back to Tournaments
            </Link>
          </div>
        </header>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-md dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
                  {tournament.name}
                </h1>
                {tournament.isOnline && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    <svg
                      className="h-4 w-4"
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
            </div>
            <div className="flex shrink-0 flex-col items-start gap-1 rounded-lg bg-emerald-50 px-4 py-3 dark:bg-emerald-900/20 sm:items-end">
              <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">
                {daysUntil}
              </div>
              <div className="text-sm font-medium uppercase text-emerald-700 dark:text-emerald-400">
                {daysUntil === 1 ? "day left" : "days left"}
              </div>
            </div>
          </div>

          {tournament.description && (
            <div className="mb-6 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/50">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
                Description
              </h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {tournament.description}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
              Tournament Details
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
                <svg
                  className="h-5 w-5 shrink-0 text-zinc-500 dark:text-zinc-400"
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
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Start Date
                  </div>
                  <div className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {formatDate(tournament.startDate)}
                  </div>
                </div>
              </div>

              {tournament.endDate && (
                <div className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
                  <svg
                    className="h-5 w-5 shrink-0 text-zinc-500 dark:text-zinc-400"
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
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      End Date
                    </div>
                    <div className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {formatDate(tournament.endDate)}
                    </div>
                  </div>
                </div>
              )}

              {tournament.location && (
                <div className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
                  <svg
                    className="h-5 w-5 shrink-0 text-zinc-500 dark:text-zinc-400"
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
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      Location
                    </div>
                    <div className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {tournament.location}
                    </div>
                  </div>
                </div>
              )}

              {tournament.phone && (
                <div className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
                  <svg
                    className="h-5 w-5 shrink-0 text-zinc-500 dark:text-zinc-400"
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
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      Contact
                    </div>
                    <div className="mt-1">
                      <a
                        href={`tel:${tournament.phone.split("/")[0].trim()}`}
                        className="text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
                      >
                        {tournament.phone}
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {tournament.link && (
              <div className="mt-6">
                <a
                  href={tournament.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 active:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 dark:active:bg-emerald-600 sm:w-auto"
                >
                  <svg
                    className="h-5 w-5 shrink-0"
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
                  <span className="truncate">View Tournament Details</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
