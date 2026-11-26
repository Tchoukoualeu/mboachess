import { useState, type CSSProperties, type PointerEvent } from "react"
import { LocaleLink } from "@/components/LocaleLink"
import { fill, type Dictionary } from "@/lib/i18n"
import type { WallOfFameCard } from "@/server/prodigeWallOfFame"

function formatPoints(points: number): string {
  return Number.isInteger(points) ? String(points) : points.toFixed(1)
}

function honorLines(
  card: WallOfFameCard,
  copy: Dictionary["prodigeFame"],
): string[] {
  const lines: string[] = []
  if (card.rank === 1) lines.push(copy.honors.leader)
  else if (card.rank <= 3) {
    lines.push(fill(copy.honors.rank, { rank: card.rank }))
  }
  if (card.arenaWins.length === 1) {
    lines.push(fill(copy.honors.arena, { day: card.arenaWins[0] }))
  } else if (card.arenaWins.length > 1) {
    lines.push(fill(copy.honors.arenas, { days: card.arenaWins.join(", ") }))
  }
  return lines
}

function onPointerMove(event: PointerEvent<HTMLLIElement>) {
  if (event.pointerType !== "mouse") return
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
  const el = event.currentTarget
  const box = el.getBoundingClientRect()
  const x = (event.clientX - box.left) / box.width
  const y = (event.clientY - box.top) / box.height
  el.style.setProperty("--rx", `${((0.5 - y) * 10).toFixed(2)}deg`)
  el.style.setProperty("--ry", `${((x - 0.5) * 12).toFixed(2)}deg`)
  el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`)
  el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`)
}

function onPointerLeave(event: PointerEvent<HTMLLIElement>) {
  const el = event.currentTarget
  el.style.removeProperty("--rx")
  el.style.removeProperty("--ry")
  el.style.removeProperty("--mx")
  el.style.removeProperty("--my")
}

export function FameCard({
  card,
  copy,
  rest,
}: {
  card: WallOfFameCard
  copy: Dictionary["prodigeFame"]
  rest: string
}) {
  const [photoOk, setPhotoOk] = useState(true)
  const honors = honorLines(card, copy)
  const stats = [
    fill(card.wins === 1 ? copy.winOne : copy.wins, { count: card.wins }),
    fill(card.arenas === 1 ? copy.arenaOne : copy.arenas, {
      count: card.arenas,
    }),
    fill(copy.best, { points: formatPoints(card.best) }),
  ].join(" · ")
  const showPhoto = Boolean(card.avatarUrl) && photoOk

  return (
    <li
      className="fame-slot"
      style={{ "--rest-ry": rest } as CSSProperties}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <LocaleLink
        to="/prodige-league/player/$username"
        params={{ username: card.username }}
        className="fame-hit"
      >
        <span className={`fame-card fame-card--${card.tier}`}>
          <span className="fame-card__well">
            {showPhoto ? (
              <img
                src={card.avatarUrl ?? undefined}
                alt=""
                width={320}
                height={320}
                className="fame-card__photo"
                onError={() => setPhotoOk(false)}
              />
            ) : (
              <span className="fame-card__mono" aria-hidden>
                {card.username.slice(0, 1).toUpperCase()}
              </span>
            )}
            <span className="fame-card__holo" aria-hidden />
            <span className="fame-card__glare" aria-hidden />
          </span>
          <span className="fame-card__shade" aria-hidden />

          <span className="fame-card__top">
            <span className="fame-card__tier">{copy.tiers[card.tier]}</span>
            <span className="fame-card__score">
              <span className="fame-card__hp-num">
                {formatPoints(card.points)}
              </span>
              <span className="fame-card__hp-meta">
                <span>{copy.points}</span>
                <span>#{card.rank}</span>
              </span>
            </span>
          </span>

          <span className="fame-card__body">
            <span className="fame-card__name" title={card.username}>
              {card.username}
            </span>
            {typeof card.rapid === "number" ? (
              <span className="fame-card__rapid">
                {fill(copy.rapid, { rating: card.rapid })}
              </span>
            ) : null}
            {honors.map((line) => (
              <span key={line} className="fame-card__honor">
                {line}
              </span>
            ))}
            <span className="fame-card__stats">{stats}</span>
          </span>
        </span>
      </LocaleLink>
    </li>
  )
}
