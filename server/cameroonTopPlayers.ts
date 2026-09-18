import { createServerFn } from "@tanstack/react-start"
import { getCameroonTopPlayers } from "@/lib/cameroonTopPlayers"

export const loadCameroonTopPlayers = createServerFn({ method: "GET" }).handler(
  () => getCameroonTopPlayers(),
)
