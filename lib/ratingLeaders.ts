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
