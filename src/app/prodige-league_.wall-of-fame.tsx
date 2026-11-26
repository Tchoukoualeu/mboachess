import { createFileRoute } from "@tanstack/react-router"
import { FameCard } from "@/components/FameCard"
import { LocaleLink } from "@/components/LocaleLink"
import {
  getDictionary,
  useDictionary,
  useRouteLoaderData,
  type Locale,
} from "@/lib/i18n"
import { pageHead } from "@/lib/seo"
import {
  loadWallOfFame,
  type WallOfFameCard,
} from "@/server/prodigeWallOfFame"

const PATH = "/prodige-league/wall-of-fame"

const REST_TILT = ["-4deg", "3.5deg", "-2.5deg", "4deg", "-3deg", "2.5deg"]

export function fameHead(locale: Locale) {
  const copy = getDictionary(locale).prodigeFame
  return pageHead({
    title: copy.metaTitle,
    description: copy.metaDescription,
    path: PATH,
    locale,
  })
}

export const Route = createFileRoute("/prodige-league_/wall-of-fame")({
  head: () => fameHead("fr"),
  loader: () => loadWallOfFame(),
  component: WallOfFamePage,
})

export function WallOfFamePage() {
  const dict = useDictionary()
  const copy = dict.prodigeFame
  const cards = useRouteLoaderData<WallOfFameCard[]>()

  return (
    <main className="fame-wall flex-1">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <p className="mb-6">
          <LocaleLink
            to="/prodige-league"
            activeOptions={{ exact: true }}
            className="text-sm text-white/70 underline decoration-white/25 underline-offset-4 hover:text-white"
          >
            {dict.prodigeArena.back}
          </LocaleLink>
        </p>
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">
            {copy.kicker}
          </p>
          <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {copy.title}
          </h1>
          <p className="mt-3 text-base leading-7 text-white/80">{copy.lede}</p>
        </header>

        {cards.length === 0 ? (
          <p className="mx-auto mt-10 max-w-lg rounded-2xl border border-white/15 px-4 py-8 text-center text-sm text-white/70">
            {copy.empty}
          </p>
        ) : (
          <ul className="fame-grid">
            {cards.map((card, index) => (
              <FameCard
                key={card.username}
                card={card}
                copy={copy}
                rest={REST_TILT[index % REST_TILT.length]}
              />
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
