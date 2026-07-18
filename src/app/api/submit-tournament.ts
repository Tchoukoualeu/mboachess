import { createFileRoute } from "@tanstack/react-router"
import { saveTournament } from "@/lib/tournaments"
import { datetimeLocalToUTC } from "@/lib/utils"
import { TOURNAMENT_TIMEZONE } from "@/lib/constants"

export const Route = createFileRoute("/api/submit-tournament")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown
        try {
          body = await request.json()
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 })
        }

        if (typeof body !== "object" || body === null) {
          return Response.json({ error: "Invalid request" }, { status: 400 })
        }

        const data = body as Record<string, unknown>

        if (!data.name || typeof data.name !== "string") {
          return Response.json(
            { error: "Missing tournament name" },
            { status: 400 },
          )
        }

        if (!data.startDate || typeof data.startDate !== "string") {
          return Response.json({ error: "Missing start date" }, { status: 400 })
        }

        // Extract user's timezone (fallback to German timezone if not provided)
        const userTimezone =
          data.userTimezone && typeof data.userTimezone === "string"
            ? data.userTimezone
            : TOURNAMENT_TIMEZONE

        // Convert datetime-local input from user's timezone to UTC for storage
        const startDate = datetimeLocalToUTC(data.startDate, userTimezone)
        if (isNaN(startDate.getTime())) {
          return Response.json({ error: "Invalid start date" }, { status: 400 })
        }

        if (startDate < new Date()) {
          return Response.json(
            { error: "Tournament must start in the future" },
            { status: 400 },
          )
        }

        const tournament = {
          name: data.name,
          startDate,
          endDate:
            data.endDate && typeof data.endDate === "string"
              ? datetimeLocalToUTC(data.endDate, userTimezone) // Convert end date from user's timezone to UTC
              : undefined,
          location:
            data.location && typeof data.location === "string"
              ? data.location
              : undefined,
          description:
            data.description && typeof data.description === "string"
              ? data.description
              : undefined,
          link:
            data.link && typeof data.link === "string" ? data.link : undefined,
          phone:
            data.phone && typeof data.phone === "string"
              ? data.phone
              : undefined,
          isOnline: data.isOnline === true ? true : undefined,
        }

        const result = await saveTournament(tournament)

        if (result === "unconfigured") {
          return Response.json(
            { error: "Database is not configured on the server." },
            { status: 503 },
          )
        }

        if (result === "invalid") {
          return Response.json(
            { error: "Invalid tournament data" },
            { status: 400 },
          )
        }

        return Response.json({ ok: true })
      },
    },
  },
})
