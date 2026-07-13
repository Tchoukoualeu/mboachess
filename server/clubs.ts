import { createServerFn } from "@tanstack/react-start"
import { getClubs } from "@/lib/clubs"

export const loadClubs = createServerFn({ method: "GET" }).handler(
  async () => getClubs(),
)
