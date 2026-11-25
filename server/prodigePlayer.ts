import { createServerFn } from "@tanstack/react-start"
import { fetchPlayerSnapshot } from "@/lib/chesscom"
import { normalizeChesscomUsername } from "@/lib/chesscomUsernames"
import {
  loadProdigePlayerProfile,
  type ProdigePlayerProfile,
} from "@/lib/prodigeArenaResults"

export type ProdigePlayerPageData = ProdigePlayerProfile & {
  avatarUrl: string | null
  countryCode: string | null
  rapid: number | null
  blitz: number | null
  bullet: number | null
}

export const loadProdigePlayer = createServerFn({ method: "GET" })
  .validator((data: string) => data)
  .handler(async ({ data }): Promise<ProdigePlayerPageData | null> => {
    const username = normalizeChesscomUsername(data)
    if (!username) return null

    const profile = await loadProdigePlayerProfile(username)
    if (!profile) return null

    const snapshot = await fetchPlayerSnapshot(profile.username).catch(() => null)
    return {
      ...profile,
      avatarUrl: snapshot?.avatarUrl ?? null,
      countryCode: snapshot?.countryCode ?? null,
      rapid: snapshot?.rapid ?? null,
      blitz: snapshot?.blitz ?? null,
      bullet: snapshot?.bullet ?? null,
    }
  })
