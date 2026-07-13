import { createServerFn } from "@tanstack/react-start"
import { getTournaments } from "@/lib/tournaments"

export const loadTournaments = createServerFn({ method: "GET" }).handler(
  async () => getTournaments(),
)
