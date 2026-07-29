import { createFileRoute } from "@tanstack/react-router"
import { createRatingSpeedRun } from "@/lib/ratingSpeedRun"

export const Route = createFileRoute("/api/rating-speed-run/create")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown
        try {
          body = await request.json()
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 })
        }

        const ratingType =
          typeof body === "object" &&
          body !== null &&
          "ratingType" in body &&
          typeof (body as { ratingType: unknown }).ratingType === "string"
            ? (body as { ratingType: string }).ratingType
            : null
        const title =
          typeof body === "object" &&
          body !== null &&
          "title" in body &&
          typeof (body as { title: unknown }).title === "string"
            ? (body as { title: string }).title
            : undefined
        const description =
          typeof body === "object" &&
          body !== null &&
          "description" in body &&
          typeof (body as { description: unknown }).description === "string"
            ? (body as { description: string }).description
            : undefined
        const prize =
          typeof body === "object" &&
          body !== null &&
          "prize" in body &&
          typeof (body as { prize: unknown }).prize === "string"
            ? (body as { prize: string }).prize
            : undefined

        if (
          ratingType !== "blitz" &&
          ratingType !== "rapid" &&
          ratingType !== "bullet"
        ) {
          return Response.json(
            { error: "Invalid rating type." },
            { status: 400 },
          )
        }

        const result = await createRatingSpeedRun({
          title,
          description,
          prize,
          ratingType,
        })
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
