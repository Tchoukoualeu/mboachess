import { timingSafeEqual } from "node:crypto"
import { createFileRoute } from "@tanstack/react-router"
import { isMongoConfigured } from "@/lib/mongodb"
import { runEloSnapshotCron } from "@/server/eloCron"

function isCronAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const header = request.headers.get("authorization") ?? ""
  const expected = `Bearer ${secret}`
  const received = Buffer.from(header)
  const wanted = Buffer.from(expected)
  if (received.length !== wanted.length) return false
  return timingSafeEqual(received, wanted)
}

export const Route = createFileRoute("/api/cron/elo-snapshots")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!isCronAuthorized(request)) {
          return Response.json({ error: "Unauthorized" }, { status: 401 })
        }
        if (!isMongoConfigured()) {
          return Response.json(
            { error: "Database is not configured on the server." },
            { status: 503 },
          )
        }
        const result = await runEloSnapshotCron()
        return Response.json({ ok: true, ...result })
      },
    },
  },
})
