import { createServerFn } from "@tanstack/react-start"
import { fetchPlayerSnapshot } from "@/lib/chesscom"
import { loadFinishedArenas } from "@/lib/prodigeArenaResults"
import {
  selectWallOfFame,
  type WallOfFameInductee,
} from "@/lib/prodigeWallOfFame"

export type WallOfFameCard = WallOfFameInductee & {
  avatarUrl: string | null
  rapid: number | null
}

const FETCH_CONCURRENCY = 8

async function mapWithConcurrency<T, R>(
  items: readonly T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length)
  let next = 0
  async function worker() {
    while (next < items.length) {
      const index = next++
      results[index] = await fn(items[index])
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, worker),
  )
  return results
}

export const loadWallOfFame = createServerFn({ method: "GET" }).handler(
  async (): Promise<WallOfFameCard[]> => {
    const inductees = selectWallOfFame(await loadFinishedArenas())
    const unique = inductees.map((player) => player.username.toLowerCase())
    const snapshots = await mapWithConcurrency(
      unique,
      FETCH_CONCURRENCY,
      (username) => fetchPlayerSnapshot(username).catch(() => null),
    )
    const profiles = new Map(
      unique.map((username, index) => {
        const snapshot = snapshots[index]
        return [
          username,
          {
            avatarUrl: snapshot?.avatarUrl ?? null,
            rapid: snapshot?.rapid ?? null,
          },
        ] as const
      }),
    )

    return inductees.map((player) => {
      const profile = profiles.get(player.username.toLowerCase())
      return {
        ...player,
        avatarUrl: profile?.avatarUrl ?? null,
        rapid: profile?.rapid ?? null,
      }
    })
  },
)
