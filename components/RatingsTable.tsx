import { useId, useMemo, useState } from "react"
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

type SortKey = "username" | "blitz" | "rapid" | "lastOnline"

type SortDir = "asc" | "desc"

const COLUMNS: { key: SortKey; label: string; numeric?: boolean }[] = [
  { key: "username", label: "Player" },
  { key: "blitz", label: "Blitz", numeric: true },
  { key: "rapid", label: "Rapid", numeric: true },
  { key: "lastOnline", label: "Last seen", numeric: true },
]

/** Rows shown before the "Show all" toggle. */
const INITIAL_VISIBLE = 25

/** Sits just under the sticky site header (h-16). */
const STICKY_HEAD_CLASS = "sticky top-16 z-10"

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
    case "lastOnline":
      result = compareNullableNumber(a.lastOnline, b.lastOnline, dir)
      break
  }

  if (result !== 0) return result
  return a.username.localeCompare(b.username, undefined, {
    sensitivity: "base",
  })
}

function defaultDir(key: SortKey): SortDir {
  return key === "username" ? "asc" : "desc"
}

function profileUrl(username: string): string {
  return `https://www.chess.com/member/${encodeURIComponent(username)}`
}

function PlayerAvatar({ row }: { row: PlayerLookupResult }) {
  return (
    <span className="relative h-8 w-8 shrink-0">
      <span className="flex h-full w-full overflow-hidden rounded-full border border-border bg-brand-muted">
        {row.avatarUrl ? (
          <img
            src={row.avatarUrl}
            alt=""
            width={32}
            height={32}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-brand">
            {row.username.slice(0, 1).toUpperCase()}
          </span>
        )}
      </span>
      {row.online ? (
        <span
          role="img"
          aria-label="Online"
          title="Online"
          className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full bg-brand ring-2 ring-surface"
        />
      ) : null}
    </span>
  )
}

/** Username, closed-account badge, and flag for players outside Cameroon. */
function PlayerIdentity({ row }: { row: PlayerLookupResult }) {
  const closed = isClosedChesscomAccount(row.accountStatus)
  const foreign =
    row.countryCode != null && row.countryCode.toUpperCase() !== "CM"

  return (
    <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
      <a
        href={profileUrl(row.username)}
        target="_blank"
        rel="noreferrer"
        className="truncate font-mono text-sm text-foreground hover:text-brand hover:underline hover:decoration-brand/40 hover:underline-offset-2"
      >
        {row.username}
      </a>
      {foreign && row.countryCode ? (
        <span
          role="img"
          aria-label={getCountryName(row.countryCode)}
          title={getCountryName(row.countryCode)}
          className="text-base leading-none"
        >
          {countryCodeToFlag(row.countryCode)}
        </span>
      ) : null}
      {closed ? (
        <span
          title={
            row.accountStatus === "closed:fair_play_violations"
              ? "Chess.com closed this account for fair play violations"
              : "Chess.com closed this account"
          }
          className="rounded-md bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-700 dark:bg-red-950/50 dark:text-red-400"
        >
          {closedAccountLabel(row.accountStatus)}
        </span>
      ) : null}
    </span>
  )
}

type Props = {
  rows: PlayerLookupResult[]
}

export function RatingsTable({ rows }: Props) {
  const searchId = useId()
  const sortId = useId()
  const [sortKey, setSortKey] = useState<SortKey>("rapid")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [query, setQuery] = useState("")
  const [showAll, setShowAll] = useState(false)

  const ranked = useMemo(
    () =>
      [...rows]
        .sort((a, b) => compareRows(a, b, sortKey, sortDir))
        .map((row, index) => ({ row, rank: index + 1 })),
    [rows, sortKey, sortDir],
  )

  const needle = query.trim().toLowerCase()
  const matches = needle
    ? ranked.filter(({ row }) => row.username.toLowerCase().includes(needle))
    : ranked
  const truncated = !needle && !showAll && matches.length > INITIAL_VISIBLE
  const visible = truncated ? matches.slice(0, INITIAL_VISIBLE) : matches

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
      return
    }
    setSortKey(key)
    setSortDir(defaultDir(key))
  }

  function selectSort(key: SortKey) {
    setSortKey(key)
    setSortDir(defaultDir(key))
  }

  const rowTint = (row: PlayerLookupResult) =>
    isClosedChesscomAccount(row.accountStatus)
      ? "bg-red-50/80 dark:bg-red-950/20"
      : ""

  return (
    <div>
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <label htmlFor={searchId} className="sr-only">
          Search players
        </label>
        <input
          id={searchId}
          type="search"
          placeholder="Search by username…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm shadow-sm placeholder:text-ink-muted/70 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25 sm:max-w-xs"
        />
        <div className="flex items-center gap-2 md:hidden">
          <label htmlFor={sortId} className="shrink-0 text-sm text-ink-muted">
            Sort by
          </label>
          <select
            id={sortId}
            value={sortKey}
            onChange={(e) => selectSort(e.target.value as SortKey)}
            className="h-10 flex-1 rounded-lg border border-border bg-surface px-2 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25"
          >
            {COLUMNS.map((col) => (
              <option key={col.key} value={col.key}>
                {col.key === "username" ? "Name" : col.label}
              </option>
            ))}
          </select>
        </div>
        <p className="text-sm text-ink-muted sm:ml-auto" aria-live="polite">
          {needle
            ? `${matches.length} of ${rows.length} players`
            : `Showing ${visible.length} of ${rows.length}`}
        </p>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-surface px-4 py-8 text-center text-sm text-ink-muted">
          No player matches “{query.trim()}”.{" "}
          <a href="#submit" className="font-medium text-brand hover:underline">
            Add them to the list
          </a>
          .
        </div>
      ) : (
        <>
          <ol className="divide-y divide-border/70 rounded-xl border border-border bg-surface shadow-sm md:hidden">
            {visible.map(({ row, rank }) => (
              <li
                key={row.username}
                className={`flex items-center gap-3 px-3 py-3 ${rowTint(row)}`}
              >
                <span className="w-6 shrink-0 text-right text-xs font-semibold tabular-nums text-ink-muted">
                  {rank}
                </span>
                <PlayerAvatar row={row} />
                <span className="min-w-0 flex-1">
                  <PlayerIdentity row={row} />
                  <span className="mt-0.5 block text-xs text-ink-muted">
                    {formatLastSeen(row.lastOnline)}
                  </span>
                </span>
                <span className="shrink-0 text-right text-xs tabular-nums">
                  <span className="block">
                    <span className="text-ink-muted">Blitz </span>
                    <span className="font-semibold">
                      {formatRating(row.blitz, row.error)}
                    </span>
                  </span>
                  <span className="block">
                    <span className="text-ink-muted">Rapid </span>
                    <span className="font-semibold">
                      {formatRating(row.rapid, row.error)}
                    </span>
                  </span>
                </span>
              </li>
            ))}
          </ol>

          <table className="hidden w-full rounded-xl border border-separate border-spacing-0 border-border bg-surface text-left text-sm shadow-sm md:table">
            <thead>
              <tr>
                <th
                  scope="col"
                  className={`${STICKY_HEAD_CLASS} w-14 rounded-tl-xl border-b border-border bg-surface px-4 py-3 text-right font-medium text-ink-muted`}
                >
                  #
                </th>
                {COLUMNS.map((col, index) => {
                  const active = sortKey === col.key
                  const last = index === COLUMNS.length - 1
                  return (
                    <th
                      key={col.key}
                      scope="col"
                      aria-sort={
                        active
                          ? sortDir === "asc"
                            ? "ascending"
                            : "descending"
                          : "none"
                      }
                      className={`${STICKY_HEAD_CLASS} border-b border-border bg-surface px-4 py-3 font-medium ${
                        col.numeric ? "text-right" : ""
                      } ${last ? "rounded-tr-xl" : ""}`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleSort(col.key)}
                        className={`inline-flex items-center gap-1 rounded-md transition hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                          active ? "text-brand" : ""
                        }`}
                      >
                        {col.label}
                        <span
                          aria-hidden
                          className={active ? "" : "text-ink-muted opacity-40"}
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
              {visible.map(({ row, rank }) => (
                <tr
                  key={row.username}
                  className={`transition hover:bg-brand-muted/30 [&:not(:last-child)>td]:border-b [&>td]:border-border/70 ${rowTint(row)}`}
                >
                  <td className="px-4 py-2.5 text-right text-xs font-semibold tabular-nums text-ink-muted">
                    {rank}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="flex items-center gap-3">
                      <PlayerAvatar row={row} />
                      <PlayerIdentity row={row} />
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums">
                    {formatRating(row.blitz, row.error)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold tabular-nums">
                    {formatRating(row.rapid, row.error)}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-ink-muted">
                    {formatLastSeen(row.lastOnline)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {!needle && matches.length > INITIAL_VISIBLE ? (
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll((value) => !value)}
            className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-brand shadow-sm transition hover:border-brand/40 hover:bg-brand-muted/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {showAll
              ? `Show top ${INITIAL_VISIBLE}`
              : `Show all ${rows.length} players`}
          </button>
        </div>
      ) : null}

      {rows.some((r) => r.error) ? (
        <p className="mt-3 text-xs text-wood">
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
