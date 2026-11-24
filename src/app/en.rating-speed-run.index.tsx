import { createFileRoute } from "@tanstack/react-router"
import { loadRatingSpeedRuns } from "@/server/ratingSpeedRun"
import { RatingSpeedRunIndexPage, speedRunHead } from "./rating-speed-run.index"

export const Route = createFileRoute("/en/rating-speed-run/")({
  head: () => speedRunHead("en"),
  validateSearch: (search: Record<string, unknown>): { admin?: boolean } => {
    if (search.admin === "true" || search.admin === true) {
      return { admin: true }
    }
    return {}
  },
  loader: () => loadRatingSpeedRuns(),
  component: RatingSpeedRunIndexPage,
})
