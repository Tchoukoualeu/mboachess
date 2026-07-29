import { createServerFn } from "@tanstack/react-start"
import {
  getLatestRatingSpeedRun,
  getRatingSpeedRunById,
  getRatingSpeedRuns,
} from "@/lib/ratingSpeedRun"

export const loadLatestRatingSpeedRun = createServerFn({
  method: "GET",
}).handler(async () => getLatestRatingSpeedRun())

export const loadRatingSpeedRuns = createServerFn({ method: "GET" }).handler(
  async () => getRatingSpeedRuns(),
)

export const loadRatingSpeedRunById = createServerFn({ method: "GET" })
  .validator((data: string) => data)
  .handler(async ({ data }) => getRatingSpeedRunById(data))
