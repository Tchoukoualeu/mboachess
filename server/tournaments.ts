import { createServerFn } from "@tanstack/react-start"
import { getTournaments, getTournamentByIndex } from "@/lib/tournaments"

export const loadTournaments = createServerFn({ method: "GET" }).handler(
  async () => getTournaments(),
)

export const loadTournamentByIndex = createServerFn({ method: "GET" })
  .validator((data: number) => data)
  .handler(async ({ data }) => getTournamentByIndex(data))
