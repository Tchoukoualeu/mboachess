import { createFileRoute, Link, notFound } from "@tanstack/react-router"
import { PageShell } from "@/components/PageShell"
import { RatingSpeedRunCompetitionView } from "@/components/RatingSpeedRunCompetitionView"
import { pageHead } from "@/lib/seo"
import { loadRatingSpeedRunById } from "@/server/ratingSpeedRun"
import type { RatingSpeedRunCompetition } from "@/lib/ratingSpeedRunShared"

export const Route = createFileRoute("/rating-speed-run/$id")({
  head: ({ loaderData, params }) => {
    const competition = loaderData as RatingSpeedRunCompetition | undefined
    const titleName = competition?.title
    const title = titleName
      ? `${titleName} | Rating speed run | mboachess`
      : "Rating speed run | mboachess"
    const description = titleName
      ? `Follow ${titleName} on mboachess — registration, leaderboard, and results.`
      : "View a single rating speed run competition."
    return pageHead({
      title,
      description,
      path: `/rating-speed-run/${params.id}`,
    })
  },
  loader: async ({ params }): Promise<RatingSpeedRunCompetition> => {
    const competition = await loadRatingSpeedRunById({ data: params.id })
    if (!competition) throw notFound()
    return competition
  },
  component: RatingSpeedRunDetailPage,
})

function RatingSpeedRunDetailPage() {
  const competition = Route.useLoaderData() as RatingSpeedRunCompetition

  return (
    <PageShell wide>
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="mb-2">
            <Link
              to="/rating-speed-run"
              search={{}}
              className="text-sm text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
            >
              ← Speed runs
            </Link>
          </p>
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            {competition.title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-muted">
            Registration, rules, prize, and the full leaderboard for this
            competition.
          </p>
        </div>
        <div className="rounded-xl bg-surface-muted px-4 py-3 text-sm text-ink-muted">
          <div className="font-medium text-foreground">Eligibility</div>
          <div>
            Chess.com account must be at least 60 days old at start time, and
            rated at least 400 in the competition category.
          </div>
        </div>
      </header>

      <RatingSpeedRunCompetitionView
        competition={competition}
        showBackToList={true}
      />
    </PageShell>
  )
}
