import { createServerFn } from "@tanstack/react-start"
import {
  getTournaments,
  getTournamentById,
  getTournamentByIndex,
} from "@/lib/tournaments"

export const loadTournaments = createServerFn({ method: "GET" }).handler(
  async () => getTournaments(),
)

export const loadTournamentById = createServerFn({ method: "GET" })
  .validator((data: string) => data)
  .handler(async ({ data }) => getTournamentById(data))

export const loadTournamentByIndex = createServerFn({ method: "GET" })
  .validator((data: number) => data)
  .handler(async ({ data }) => getTournamentByIndex(data))
