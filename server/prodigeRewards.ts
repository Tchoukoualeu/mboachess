import { createServerFn } from "@tanstack/react-start"
import { fetchPlayerSnapshot } from "@/lib/chesscom"
import { loadFinishedArenas } from "@/lib/prodigeArenaResults"
import {
  computeProdigeRewards,
  type ProdigeRewardBlock,
  type ProdigeRewardRow,
} from "@/lib/prodigeRewards"

export type ProdigeRewardRowView = ProdigeRewardRow & {
  avatarUrl: string | null
}

export type ProdigeRewardsPage = {
  arenaCount: number
  gameCount: number
  rewards: Array<Omit<ProdigeRewardBlock, "rows"> & { rows: ProdigeRewardRowView[] }>
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

async function avatarMap(usernames: string[]): Promise<Map<string, string | null>> {
  const unique = [...new Set(usernames.map((username) => username.toLowerCase()))]
  const snapshots = await mapWithConcurrency(unique, FETCH_CONCURRENCY, (username) =>
    fetchPlayerSnapshot(username).catch(() => null),
  )
  return new Map(
    unique.map((username, index) => [username, snapshots[index]?.avatarUrl ?? null]),
  )
}

export const loadProdigeRewardsPage = createServerFn({ method: "GET" }).handler(
  async (): Promise<ProdigeRewardsPage> => {
    const board = computeProdigeRewards(await loadFinishedArenas())
    const avatars = await avatarMap(
      board.rewards.flatMap((reward) => reward.rows.map((row) => row.username)),
    )
    return {
      arenaCount: board.arenaCount,
      gameCount: board.gameCount,
      rewards: board.rewards.map((reward) => ({
        ...reward,
        rows: reward.rows.map((row) => ({
          ...row,
          avatarUrl: avatars.get(row.username.toLowerCase()) ?? null,
        })),
      })),
    }
  },
)
