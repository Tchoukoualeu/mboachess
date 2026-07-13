import { createFileRoute, Link } from "@tanstack/react-router"
import { AddClubForm } from "@/components/AddClubForm"
import { loadClubs } from "@/server/clubs"
import { pageHead } from "@/lib/seo"

export const Route = createFileRoute("/clubs")({
  head: () =>
    pageHead({
      title: "Chess Clubs in Cameroon | mboachess",
      description:
        "Find and join chess clubs across Cameroon. Discover meeting schedules, locations, and contact details for local chess communities.",
      path: "/clubs",
    }),
  loader: () => loadClubs(),
  component: ClubsPage,
})

function ClubsPage() {
  const clubs = Route.useLoaderData()

  return (
    <div className="min-h-dvh flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-5 sm:px-6 sm:py-8">
        <header className="mb-4 sm:mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl">
              Chess Clubs
            </h1>
            <Link
              to="/"
              className="text-sm text-emerald-700 underline decoration-emerald-700/30 underline-offset-2 hover:decoration-emerald-600 dark:text-emerald-400 dark:decoration-emerald-400/40"
            >
              Back to Home
            </Link>
          </div>
          <p className="max-w-2xl text-xs leading-5 text-zinc-600 sm:text-sm sm:leading-6 dark:text-zinc-400">
            Find and join chess clubs in your area. Add your club to connect
            with other players.
          </p>
        </header>

        <AddClubForm />

        {clubs.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
            <p className="text-zinc-600 dark:text-zinc-400">
              No clubs yet. Be the first to add your chess club!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              All Clubs ({clubs.length})
            </div>
            {clubs.map((club, index) => (
              <div
                key={index}
                className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-6"
              >
                <div className="flex flex-col gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      {club.name}
                    </h3>
                    {club.description && (
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        {club.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 text-sm">
                    {club.location && (
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
                        <span>{club.location}</span>
                      </div>
                    )}

                    {club.meetingSchedule && (
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
                        <span>{club.meetingSchedule}</span>
                      </div>
                    )}

                    {club.contactName && (
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span>Contact: {club.contactName}</span>
                      </div>
                    )}

                    {club.phone && (
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
                          href={`tel:${club.phone}`}
                          className="text-emerald-700 hover:underline dark:text-emerald-400"
                        >
                          {club.phone}
                        </a>
                      </div>
                    )}

                    {club.email && (
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
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <a
                          href={`mailto:${club.email}`}
                          className="text-emerald-700 hover:underline dark:text-emerald-400"
                        >
                          {club.email}
                        </a>
                      </div>
                    )}

                    {club.website && (
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
                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                          />
                        </svg>
                        <a
                          href={club.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 underline decoration-emerald-700/30 underline-offset-2 hover:decoration-emerald-600 dark:text-emerald-400 dark:decoration-emerald-400/40"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
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
