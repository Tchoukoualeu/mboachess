import { createFileRoute, notFound } from "@tanstack/react-router"
import { loadRatingSpeedRunById } from "@/server/ratingSpeedRun"
import { RatingSpeedRunDetailPage, speedRunDetailHead } from "./rating-speed-run.$id"

export const Route = createFileRoute("/en/rating-speed-run/$id")({
  head: ({ loaderData, params }) => speedRunDetailHead("en", loaderData, params.id),
  loader: async ({ params }) => {
    const competition = await loadRatingSpeedRunById({ data: params.id })
    if (!competition) throw notFound()
    return competition
  },
  component: RatingSpeedRunDetailPage,
})
