import { createServerFn } from "@tanstack/react-start"
import { loadProdigeArenaResults } from "@/lib/prodigeArenaResults"

export const loadProdigeArena = createServerFn({ method: "GET" })
  .validator((data: string) => data)
  .handler(async ({ data }) => loadProdigeArenaResults(data))
