import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/api/puzzle")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { fetchPuzzle, PuzzleQueryError } = await import("@/server/puzzle")
        const url = new URL(request.url)
        try {
          const puzzle = await fetchPuzzle({
            daily: url.searchParams.get("daily") === "1",
            id: url.searchParams.get("id") ?? undefined,
            angle: url.searchParams.get("angle") ?? undefined,
            difficulty: url.searchParams.get("difficulty") ?? undefined,
            color: url.searchParams.get("color") ?? undefined,
          })
          return Response.json(puzzle, {
            headers: { "Cache-Control": "no-store" },
          })
        } catch (error) {
          const status = error instanceof PuzzleQueryError ? error.status : 502
          const message =
            error instanceof Error
              ? error.message
              : "Could not load a puzzle."
          return Response.json({ error: message }, { status })
        }
      },
    },
  },
})
