import { createFileRoute } from "@tanstack/react-router"
import {
  normalizeChesscomUsername,
  saveUsername,
} from "@/lib/chesscomUsernames"

export const Route = createFileRoute("/api/submit-username")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown
        try {
          body = await request.json()
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 })
        }
        const u =
          typeof body === "object" &&
          body !== null &&
          "username" in body &&
          typeof (body as { username: unknown }).username === "string"
            ? (body as { username: string }).username
            : null
        if (u == null) {
          return Response.json({ error: "Missing username" }, { status: 400 })
        }
        if (normalizeChesscomUsername(u) == null) {
          return Response.json(
            {
              error:
                "Invalid username (use 1–50 letters, numbers, underscore, or hyphen only).",
            },
            { status: 400 },
          )
        }
        const result = await saveUsername(u)
        if (result === "unconfigured") {
          return Response.json(
            { error: "Database is not configured on the server." },
            { status: 503 },
          )
        }
        if (result === "invalid") {
          return Response.json({ error: "Invalid username" }, { status: 400 })
        }
        if (result === "exists") {
          return Response.json({ ok: true, already: true })
        }
        return Response.json({ ok: true, already: false })
      },
    },
  },
})
