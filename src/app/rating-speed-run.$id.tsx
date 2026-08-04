import { createFileRoute, Link, notFound } from "@tanstack/react-router"
import { RatingSpeedRunCompetitionView } from "@/components/RatingSpeedRunCompetitionView"
import { pageHead } from "@/lib/seo"
import { loadRatingSpeedRunById } from "@/server/ratingSpeedRun"
import type { RatingSpeedRunCompetition } from "@/lib/ratingSpeedRunShared"

export const Route = createFileRoute("/rating-speed-run/$id")({
  head: ({ params }) =>
    pageHead({
      title: "Rating speed run | mboachess",
      description: "View a single rating speed run competition.",
      path: `/rating-speed-run/${params.id}`,
    }),
  loader: async ({ params }): Promise<RatingSpeedRunCompetition> => {
    const competition = await loadRatingSpeedRunById({ data: params.id })
    if (!competition) throw notFound()
    return competition
  },
  component: RatingSpeedRunDetailPage,
})

function RatingSpeedRunDetailPage() {
  const competition = Route.useLoaderData()

  return (
    <div className="min-h-dvh flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-5 sm:px-6 sm:py-8">
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="mb-2">
              <Link
                to="/"
                className="text-sm text-emerald-700 underline decoration-emerald-700/30 underline-offset-2 hover:decoration-emerald-600 dark:text-emerald-400 dark:decoration-emerald-400/40"
              >
                Back to Home
              </Link>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Rating speed run
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Single competition view with registration, rules, prize, and the
              full leaderboard.
            </p>
          </div>
          <div className="rounded-xl bg-zinc-100 px-4 py-3 text-sm text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
            <div className="font-medium">Eligibility</div>
            <div>
              Chess.com account must be at least 60 days old at start time, and
              rated at least 400 in the competition category.
            </div>
          </div>
        </header>

        {competition && (
          <RatingSpeedRunCompetitionView
            competition={competition}
            showBackToList={true}
          />
        )}
      </div>
    </div>
  )
}
