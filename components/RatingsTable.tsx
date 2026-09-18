import { useMemo, useState } from "react"
import {
  isClosedChesscomAccount,
  type PlayerLookupResult,
} from "@/lib/chesscom"

/** Convert ISO country code to flag emoji (e.g., "CM" -> "🇨🇲"). */
function countryCodeToFlag(code: string): string {
  return code
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("")
}

/** Map common country codes to full country names. */
const COUNTRY_NAMES: Record<string, string> = {
  CM: "Cameroon",
  US: "United States",
  GB: "United Kingdom",
  FR: "France",
  DE: "Germany",
  ES: "Spain",
  IT: "Italy",
  CA: "Canada",
  AU: "Australia",
  BR: "Brazil",
  AR: "Argentina",
  MX: "Mexico",
  IN: "India",
  CN: "China",
  JP: "Japan",
  KR: "South Korea",
  RU: "Russia",
  UA: "Ukraine",
  PL: "Poland",
  NL: "Netherlands",
  BE: "Belgium",
  CH: "Switzerland",
  AT: "Austria",
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  FI: "Finland",
  PT: "Portugal",
  GR: "Greece",
  TR: "Turkey",
  ZA: "South Africa",
  EG: "Egypt",
  NG: "Nigeria",
  KE: "Kenya",
  GH: "Ghana",
  MA: "Morocco",
  TN: "Tunisia",
  DZ: "Algeria",
  SN: "Senegal",
  CI: "Ivory Coast",
  UG: "Uganda",
  TZ: "Tanzania",
  ET: "Ethiopia",
  ZW: "Zimbabwe",
  BW: "Botswana",
  RW: "Rwanda",
  CD: "DR Congo",
  CG: "Congo",
  GA: "Gabon",
  ML: "Mali",
  BF: "Burkina Faso",
  NE: "Niger",
  TD: "Chad",
  CF: "Central African Republic",
  GQ: "Equatorial Guinea",
}

function getCountryName(code: string | null): string {
  if (!code) return "Unknown"
  return COUNTRY_NAMES[code.toUpperCase()] || code.toUpperCase()
}

function formatLastSeen(unix: number | null): string {
  if (unix == null) return "—"
  const s = Date.now() / 1000 - unix
  if (s < 60) return "just now"
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

function closedAccountLabel(accountStatus: string | null): string {
  if (accountStatus === "closed:fair_play_violations") {
    return "Closed (fair play)"
  }
  return "Closed"
}

function formatRating(
  value: number | null,
  error: string | undefined,
): string | number {
  if (error && /not found/i.test(error)) return "—"
  if (value != null) return value
  if (error) return "—"
  return "Unrated"
}

type SortKey =
  | "username"
  | "blitz"
  | "rapid"
  | "online"
  | "lastOnline"
  | "country"

type SortDir = "asc" | "desc"

const COLUMNS: { key: SortKey; label: string; muted?: boolean }[] = [
  { key: "username", label: "Username" },
  { key: "blitz", label: "Blitz" },
  { key: "rapid", label: "Rapid" },
  { key: "online", label: "Online" },
  { key: "lastOnline", label: "Last seen", muted: true },
  { key: "country", label: "Country" },
]

function compareNullableNumber(
  a: number | null,
  b: number | null,
  dir: SortDir,
): number {
  const aMissing = a == null
  const bMissing = b == null
  if (aMissing && bMissing) return 0
  if (aMissing) return 1
  if (bMissing) return -1
  return dir === "asc" ? a - b : b - a
}

function compareRows(
  a: PlayerLookupResult,
  b: PlayerLookupResult,
  key: SortKey,
  dir: SortDir,
): number {
  let result = 0

  switch (key) {
    case "username":
      result = a.username.localeCompare(b.username, undefined, {
        sensitivity: "base",
      })
      if (dir === "desc") result = -result
      break
    case "blitz":
      result = compareNullableNumber(a.blitz, b.blitz, dir)
      break
    case "rapid":
      result = compareNullableNumber(a.rapid, b.rapid, dir)
      break
    case "online":
      result = Number(a.online) - Number(b.online)
      if (dir === "desc") result = -result
      break
    case "lastOnline":
      result = compareNullableNumber(a.lastOnline, b.lastOnline, dir)
      break
    case "country": {
      const aName = getCountryName(a.countryCode)
      const bName = getCountryName(b.countryCode)
      const aMissing = !a.countryCode
      const bMissing = !b.countryCode
      if (aMissing && bMissing) result = 0
      else if (aMissing) result = 1
      else if (bMissing) result = -1
      else {
        result = aName.localeCompare(bName, undefined, { sensitivity: "base" })
        if (dir === "desc") result = -result
      }
      break
    }
  }

  if (result !== 0) return result
  return a.username.localeCompare(b.username, undefined, {
    sensitivity: "base",
  })
}

type Props = {
  rows: PlayerLookupResult[]
}

export function RatingsTable({ rows }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("rapid")
  const [sortDir, setSortDir] = useState<SortDir>("desc")

  const sortedRows = useMemo(
    () => [...rows].sort((a, b) => compareRows(a, b, sortKey, sortDir)),
    [rows, sortKey, sortDir],
  )

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
      return
    }
    setSortKey(key)
    setSortDir(key === "username" || key === "country" ? "asc" : "desc")
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface shadow-sm">
      <table className="w-full min-w-xl text-left text-sm">
        <thead>
          <tr className="border-b border-border">
            {COLUMNS.map((col) => {
              const active = sortKey === col.key
              const ariaSort = active
                ? sortDir === "asc"
                  ? "ascending"
                  : "descending"
                : "none"
              return (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={ariaSort}
                  className={`px-4 py-3 font-medium ${col.muted ? "text-ink-muted" : ""}`}
                >
                  <button
                    type="button"
                    onClick={() => toggleSort(col.key)}
                    className="inline-flex items-center gap-1 rounded-md transition hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    {col.label}
                    <span
                      aria-hidden
                      className={
                        active ? "text-brand" : "text-ink-muted opacity-40"
                      }
                    >
                      {active ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
                    </span>
                  </button>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((r) => {
            const closed = isClosedChesscomAccount(r.accountStatus)
            return (
            <tr
              key={r.username}
              className={`border-b border-border/70 last:border-0 ${
                closed ? "bg-wood/5" : ""
              }`}
            >
              <td className="px-4 py-3 font-mono text-xs sm:text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={`https://www.chess.com/member/${encodeURIComponent(
                      r.username,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
                  >
                    {r.username}
                  </a>
                  {closed ? (
                    <span
                      title={
                        r.accountStatus === "closed:fair_play_violations"
                          ? "Chess.com closed this account for fair play violations"
                          : "Chess.com closed this account"
                      }
                      className="rounded-md bg-wood/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-wood"
                    >
                      {closedAccountLabel(r.accountStatus)}
                    </span>
                  ) : null}
                </div>
              </td>
              <td className="px-4 py-3 tabular-nums">
                {formatRating(r.blitz, r.error)}
              </td>
              <td className="px-4 py-3 tabular-nums">
                {formatRating(r.rapid, r.error)}
              </td>
              <td className="px-4 py-3">
                <span
                  role="img"
                  aria-label={r.online ? "Online" : "Offline"}
                  title={r.online ? "Online" : "Offline"}
                  className={
                    r.online
                      ? "inline-block h-3 w-3 rounded-full bg-brand"
                      : "inline-block h-3 w-3 rounded-full bg-border"
                  }
                />
              </td>
              <td className="px-4 py-3 tabular-nums text-ink-muted">
                {formatLastSeen(r.lastOnline)}
              </td>
              <td className="px-4 py-3">
                {r.countryCode ? (
                  <div className="group relative inline-block cursor-help">
                    <span className="text-2xl">
                      {countryCodeToFlag(r.countryCode)}
                    </span>
                    <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                      {getCountryName(r.countryCode)}
                    </span>
                  </div>
                ) : (
                  <span className="text-ink-muted">—</span>
                )}
              </td>
            </tr>
            )
          })}
        </tbody>
      </table>
      {rows.some((r) => r.error) ? (
        <p className="border-t border-border px-4 py-3 text-xs text-wood">
          Some rows may be missing ratings:{" "}
          {rows
            .filter((r) => r.error)
            .map((r) => `${r.username} (${r.error})`)
            .join("; ")}
        </p>
      ) : null}
    </div>
  )
}
