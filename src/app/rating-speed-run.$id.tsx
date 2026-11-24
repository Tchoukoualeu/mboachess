import { createFileRoute, notFound } from "@tanstack/react-router"
import { LocaleLink } from "@/components/LocaleLink"
import { PageShell } from "@/components/PageShell"
import { RatingSpeedRunCompetitionView } from "@/components/RatingSpeedRunCompetitionView"
import { fill, getDictionary, useDictionary, useRouteLoaderData, type Locale } from "@/lib/i18n"
import { pageHead } from "@/lib/seo"
import { loadRatingSpeedRunById } from "@/server/ratingSpeedRun"
import type { RatingSpeedRunCompetition } from "@/lib/ratingSpeedRunShared"

export function speedRunDetailHead(locale: Locale, loaderData: unknown, id: string) {
  const copy = getDictionary(locale).speedRun
  const competition = loaderData as RatingSpeedRunCompetition | undefined
  const titleName = competition?.title
  return pageHead({
    title: titleName ? fill(copy.detailMeta, { name: titleName }) : copy.metaTitle,
    description: titleName
      ? fill(copy.detailDescription, { name: titleName })
      : copy.detailDescriptionFallback,
    path: `/rating-speed-run/${id}`,
    locale,
  })
}

export const Route = createFileRoute("/rating-speed-run/$id")({
  head: ({ loaderData, params }) => speedRunDetailHead("fr", loaderData, params.id),
  loader: async ({ params }): Promise<RatingSpeedRunCompetition> => {
    const competition = await loadRatingSpeedRunById({ data: params.id })
    if (!competition) throw notFound()
    return competition
  },
  component: RatingSpeedRunDetailPage,
})

export function RatingSpeedRunDetailPage() {
  const copy = useDictionary().speedRun
  const competition = useRouteLoaderData<RatingSpeedRunCompetition>()

  return (
    <PageShell wide>
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="mb-2">
            <LocaleLink
              to="/rating-speed-run"
              search={{}}
              className="text-sm text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
            >
              {copy.back}
            </LocaleLink>
          </p>
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            {competition.title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-muted">
            {copy.detailLede}
          </p>
        </div>
        <div className="rounded-xl bg-surface-muted px-4 py-3 text-sm text-ink-muted">
          <div className="font-medium text-foreground">{copy.eligibility}</div>
          <div>{copy.eligibilityBody}</div>
        </div>
      </header>

      <RatingSpeedRunCompetitionView
        competition={competition}
        showBackToList={true}
      />
    </PageShell>
  )
}
