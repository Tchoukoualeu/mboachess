import { useRouter } from "@tanstack/react-router"
import { useState } from "react"
import type { ProdigeLeaguePlayer } from "@/lib/prodigeLeague"

const PAGE_SIZE = 20

function countryCodeToFlag(code: string): string {
  return code
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("")
}

function formatRating(value: number | null): string {
  return typeof value === "number" ? String(value) : "—"
}

function formatRegisteredAt(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime()) || date.getTime() === 0) return ""
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}

function SignupForm() {
  const router = useRouter()
  const [value, setValue] = useState("")
  const [message, setMessage] = useState<{
    type: "ok" | "err"
    text: string
  } | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setMessage(null)
    const username = value.trim()
    if (!username) {
      setMessage({ type: "err", text: "Indique ton pseudo Chess.com." })
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/prodige-league", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      })
      const data = (await res.json().catch(() => ({}))) as {
        error?: string
        ok?: boolean
        already?: boolean
      }
      if (!res.ok) {
        setMessage({
          type: "err",
          text: data.error || "Inscription impossible.",
        })
        return
      }
      setMessage({
        type: "ok",
        text: data.already
          ? "Ce compte est déjà inscrit."
          : "Inscription enregistrée. Ton compte apparaît dans la liste.",
      })
      setValue("")
      await router.invalidate()
    } catch {
      setMessage({ type: "err", text: "Erreur réseau. Réessaie." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end"
    >
      <div className="min-w-0 flex-1">
        <label
          htmlFor="prodige-username"
          className="mb-1 block text-sm font-medium text-foreground"
        >
          Pseudo Chess.com
        </label>
        <input
          id="prodige-username"
          name="username"
          type="text"
          autoComplete="username"
          placeholder="ex. hikaru"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          disabled={loading}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 font-mono text-sm text-foreground shadow-sm placeholder:text-ink-muted focus:border-wood focus:outline-none focus:ring-2 focus:ring-wood/30 disabled:opacity-50"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-[#e0b45a] px-4 text-sm font-semibold text-[#1a1408] transition hover:bg-[#efc56e] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Inscription…" : "S'inscrire"}
      </button>
      {message ? (
        <p
          role="status"
          className={`w-full text-sm ${
            message.type === "ok" ? "text-brand" : "text-red-600"
          }`}
        >
          {message.text}
        </p>
      ) : null}
    </form>
  )
}

function PlayerRow({
  player,
  rank,
}: {
  player: ProdigeLeaguePlayer
  rank: number
}) {
  const href = `https://www.chess.com/member/${encodeURIComponent(player.username)}`
  const registered = formatRegisteredAt(player.registeredAt)
  const flag = player.countryCode ? countryCodeToFlag(player.countryCode) : null

  return (
    <li className="border-b border-border last:border-b-0">
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="group flex items-center gap-3 px-3 py-3 transition hover:bg-brand-muted/40 sm:gap-4 sm:px-4"
      >
        <span className="w-8 shrink-0 text-center font-mono text-sm tabular-nums text-ink-muted sm:w-10">
          {rank}
        </span>
        <div className="relative h-10 w-10 shrink-0">
          <div className="h-10 w-10 overflow-hidden rounded-full border border-border bg-surface-muted">
            {player.avatarUrl ? (
              <img
                src={player.avatarUrl}
                alt=""
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-ink-muted">
                {player.username.slice(0, 1).toUpperCase()}
              </span>
            )}
          </div>
          {player.online ? (
            <span
              className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-surface bg-brand"
              title="En ligne"
            />
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-foreground group-hover:text-brand group-hover:underline">
            {player.username}
            {flag ? (
              <span className="ml-1.5" title={player.countryCode ?? undefined}>
                {flag}
              </span>
            ) : null}
          </p>
          <p className="mt-0.5 text-xs text-ink-muted">
            {registered ? `Inscrit le ${registered}` : "Inscrit"}
            {" · "}
            Blitz {formatRating(player.blitz)}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-mono text-base font-semibold tabular-nums text-foreground sm:text-lg">
            {formatRating(player.rapid)}
          </p>
          <p className="text-[11px] uppercase tracking-wide text-ink-muted">
            Rapide
          </p>
        </div>
      </a>
    </li>
  )
}

export function ProdigeLeagueSignup({
  players,
}: {
  players: ProdigeLeaguePlayer[]
}) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const visible = players.slice(0, visibleCount)
  const remaining = Math.max(0, players.length - visibleCount)
  const nextBatch = Math.min(PAGE_SIZE, remaining)

  return (
    <section aria-labelledby="inscription-heading" id="inscription" className="mb-10">
      <h2
        id="inscription-heading"
        className="font-display text-xl font-semibold tracking-tight sm:text-2xl"
      >
        Inscription
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted sm:text-base">
        Entre ton pseudo Chess.com pour t&apos;inscrire. Les comptes au-dessus
        de 2400 Elo rapide ne peuvent pas participer. La liste est classée par
        Elo rapide, la cadence de la saison.
      </p>
      <div className="mt-4 rounded-xl border border-border bg-surface p-4 sm:p-5">
        <SignupForm />
      </div>

      <div className="mt-6 flex items-end justify-between gap-3">
        <h3 className="font-display text-lg font-semibold tracking-tight">
          Joueurs inscrits
        </h3>
        <p className="text-sm text-ink-muted">
          {players.length} {players.length === 1 ? "joueur" : "joueurs"}
        </p>
      </div>

      {players.length === 0 ? (
        <p className="mt-3 rounded-xl border border-dashed border-border bg-surface px-4 py-10 text-center text-sm text-ink-muted">
          Aucun joueur inscrit pour le moment.
        </p>
      ) : (
        <>
          <ol className="mt-3 overflow-hidden rounded-xl border border-border bg-surface">
            {visible.map((player, index) => (
              <PlayerRow
                key={player.username}
                player={player}
                rank={index + 1}
              />
            ))}
          </ol>
          {remaining > 0 ? (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() =>
                  setVisibleCount((count) =>
                    Math.min(players.length, count + PAGE_SIZE),
                  )
                }
                className="inline-flex items-center justify-center rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-brand/40 hover:bg-brand-muted/50"
              >
                Voir plus ({nextBatch})
              </button>
            </div>
          ) : null}
        </>
      )}
    </section>
  )
}
