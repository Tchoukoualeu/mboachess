import Image from "next/image"
import type { PlayerLookupResult } from "@/lib/chesscom"
import { CrownIcon } from "@/components/CrownIcon"

const AVATAR_PX = 48

type Props = {
  blitzLeader: PlayerLookupResult | null
  rapidLeader: PlayerLookupResult | null
}

function Leader({
  kind,
  leader,
  rating,
}: {
  kind: "Blitz" | "Rapid"
  leader: PlayerLookupResult | null
  rating: number | null
}) {
  if (!leader || rating == null) {
    return (
      <div className="min-w-0 flex-1 rounded-lg border border-zinc-200/90 bg-zinc-50/90 px-2 py-2 text-center dark:border-zinc-800 dark:bg-zinc-900/50 sm:px-3 sm:py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Top {kind}
        </p>
        <p className="mt-0.5 text-xs text-zinc-500">—</p>
      </div>
    )
  }

  const href = `https://www.chess.com/member/${encodeURIComponent(leader.username)}`
  const initial = leader.username.slice(0, 1).toUpperCase()

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-amber-200/70 bg-linear-to-r from-amber-50/80 to-white py-1.5 pl-1.5 pr-2 shadow-sm transition hover:border-amber-300/90 hover:shadow dark:border-amber-900/40 dark:from-amber-950/20 dark:to-zinc-900/60 sm:gap-2.5 sm:rounded-xl sm:py-2 sm:pl-2 sm:pr-3"
    >
      <div className="relative h-10 w-10 shrink-0 sm:h-12 sm:w-12">
        <div
          className="pointer-events-none absolute top-0 left-1/2 z-10 -translate-x-1/2 translate-y-[-20%] sm:translate-y-[-15%]"
          aria-hidden
        >
          <CrownIcon className="h-3.5 w-3.5 text-amber-500 drop-shadow sm:h-4 sm:w-4 dark:text-amber-400" />
        </div>
        <div className="relative h-full w-full overflow-hidden rounded-full border border-amber-200/90 bg-zinc-100 dark:border-amber-600/40 dark:bg-zinc-800">
          {leader.avatarUrl ? (
            <Image
              src={leader.avatarUrl}
              alt=""
              width={AVATAR_PX}
              height={AVATAR_PX}
              className="h-full w-full object-cover"
              sizes="(max-width: 640px) 40px, 48px"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-zinc-500 sm:text-base">
              {initial}
            </span>
          )}
        </div>
      </div>
      <div className="min-w-0 flex-1 text-left">
        <p className="text-[10px] font-semibold uppercase leading-tight tracking-wide text-amber-800/80 dark:text-amber-200/85">
          Top {kind}
        </p>
        <p className="font-mono text-base font-bold leading-tight tabular-nums text-zinc-900 sm:text-lg dark:text-zinc-100">
          {rating}
        </p>
        <p className="truncate text-[11px] font-medium text-zinc-600 group-hover:underline sm:text-xs dark:text-zinc-300">
          {leader.username}
        </p>
      </div>
    </a>
  )
}

export function RatingLeaders({ blitzLeader, rapidLeader }: Props) {
  return (
    <section
      className="mb-3 sm:mb-5"
      aria-label="Highest rated players"
    >
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <Leader
          kind="Blitz"
          leader={blitzLeader}
          rating={blitzLeader?.blitz ?? null}
        />
        <Leader
          kind="Rapid"
          leader={rapidLeader}
          rating={rapidLeader?.rapid ?? null}
        />
      </div>
    </section>
  )
}
