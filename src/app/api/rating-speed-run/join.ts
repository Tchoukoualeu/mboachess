import { createFileRoute } from "@tanstack/react-router"
import { joinRatingSpeedRun } from "@/lib/ratingSpeedRun"

export const Route = createFileRoute("/api/rating-speed-run/join")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown
        try {
          body = await request.json()
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 })
        }

        const competitionId =
          typeof body === "object" &&
          body !== null &&
          "competitionId" in body &&
          typeof (body as { competitionId: unknown }).competitionId === "string"
            ? (body as { competitionId: string }).competitionId
            : null
        const username =
          typeof body === "object" &&
          body !== null &&
          "username" in body &&
          typeof (body as { username: unknown }).username === "string"
            ? (body as { username: string }).username
            : null

        if (!competitionId || !username) {
          return Response.json(
            { error: "Missing competition ID or username." },
            { status: 400 },
          )
        }

        const result = await joinRatingSpeedRun({ competitionId, username })
        if (!result.ok) {
          return Response.json(
            { error: result.error },
            { status: result.status ?? 400 },
          )
        }

        return Response.json(result)
      },
    },
  },
})
