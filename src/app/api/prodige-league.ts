import { createFileRoute } from "@tanstack/react-router"
import { registerProdigeLeague } from "@/lib/prodigeLeague"

export const Route = createFileRoute("/api/prodige-league")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown
        try {
          body = await request.json()
        } catch {
          return Response.json({ error: "JSON invalide" }, { status: 400 })
        }

        const username =
          typeof body === "object" &&
          body !== null &&
          "username" in body &&
          typeof (body as { username: unknown }).username === "string"
            ? (body as { username: string }).username
            : null

        if (!username) {
          return Response.json(
            { error: "Indique ton pseudo Chess.com." },
            { status: 400 },
          )
        }

        const result = await registerProdigeLeague(username)
        if (!result.ok) {
          return Response.json(
            { error: result.error },
            { status: result.status },
          )
        }
        return Response.json({ ok: true, already: result.already })
      },
    },
  },
})
