import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/api/prodige-league")({
  server: {
    handlers: {
      POST: async () => {
        return Response.json(
          { error: "Les inscriptions sont closes." },
          { status: 403 },
        )
      },
    },
  },
})
