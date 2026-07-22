import { createServerFn } from "@tanstack/react-start"
import {
  getTournaments,
  getPastOnlineTournaments,
  getTournamentById,
  getTournamentByIndex,
  withChessComWinners,
} from "@/lib/tournaments"

export const loadTournaments = createServerFn({ method: "GET" }).handler(
  async () => getTournaments(),
)

export const loadPastOnlineTournaments = createServerFn({
  method: "GET",
}).handler(async () => {
  const tournaments = await getPastOnlineTournaments()
  return withChessComWinners(tournaments)
})

export const loadTournamentById = createServerFn({ method: "GET" })
  .validator((data: string) => data)
  .handler(async ({ data }) => {
    const tournament = await getTournamentById(data)
    if (!tournament) return null
    const [withWinners] = await withChessComWinners([tournament])
    return withWinners
  })

export const loadTournamentByIndex = createServerFn({ method: "GET" })
  .validator((data: number) => data)
  .handler(async ({ data }) => getTournamentByIndex(data))
