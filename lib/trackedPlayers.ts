/** Chess.com usernames followed on the homepage, before public submissions. */
export const TRACKED_USERNAMES = [
  "menxele",
  "brlliantmoves",
  "aris2021222324",
  "amicodi1pelato",
  "open2doorwithin",
] as const

/** Homepage list: the fixed names plus submitted usernames, without duplicates. */
export function mergeFollowedUsernames(submitted: readonly string[]): string[] {
  return [...new Set([...TRACKED_USERNAMES, ...submitted])].sort((a, b) =>
    a.localeCompare(b),
  )
}
