import type { PlayerLookupResult } from "@/lib/chesscom";

export function topByRating(
  rows: PlayerLookupResult[],
  mode: "blitz" | "rapid"
): PlayerLookupResult | null {
  const withRating = rows.filter(
    (r) => !r.error && typeof r[mode] === "number" && r[mode]! > 0
  );
  if (withRating.length === 0) return null;
  return withRating.reduce((best, r) => {
    const a = r[mode] as number;
    const b = best[mode] as number;
    if (a > b) return r;
    if (a < b) return best;
    return r.username.toLowerCase() < best.username.toLowerCase() ? r : best;
  });
}

export function topNByRating(
  rows: PlayerLookupResult[],
  mode: "blitz" | "rapid",
  count: number
): PlayerLookupResult[] {
  return rows
    .filter((r) => !r.error && typeof r[mode] === "number" && r[mode]! > 0)
    .sort((a, b) => {
      const diff = (b[mode] as number) - (a[mode] as number);
      if (diff !== 0) return diff;
      return a.username.toLowerCase() < b.username.toLowerCase() ? -1 : 1;
    })
    .slice(0, count);
}
