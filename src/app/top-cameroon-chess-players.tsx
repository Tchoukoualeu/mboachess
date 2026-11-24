import { createFileRoute } from "@tanstack/react-router"
import { CameroonTopPlayersList } from "@/components/CameroonTopPlayersList"
import { PageShell } from "@/components/PageShell"
import { getDictionary, useDictionary, useRouteLoaderData, type Locale } from "@/lib/i18n"
import { pageHead, webPageJsonLd } from "@/lib/seo"
import { loadCameroonTopPlayers } from "@/server/cameroonTopPlayers"

export function topPlayersHead(locale: Locale) {
  const copy = getDictionary(locale).topPlayers
  return pageHead({
    title: copy.metaTitle,
    description: copy.metaDescription,
    path: "/top-cameroon-chess-players",
    locale,
    jsonLd: webPageJsonLd({
      title: copy.metaTitle,
      description: copy.metaDescription,
      path: "/top-cameroon-chess-players",
      locale,
    }),
  })
}

export const Route = createFileRoute("/top-cameroon-chess-players")({
  head: () => topPlayersHead("fr"),
  loader: () => loadCameroonTopPlayers(),
  component: TopPlayersPage,
})

export function TopPlayersPage() {
  const copy = useDictionary().topPlayers
  const data = useRouteLoaderData<Awaited<ReturnType<typeof loadCameroonTopPlayers>>>()

  return (
    <PageShell>
      <header className="mb-6 sm:mb-8">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
          {copy.title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
          {copy.lede}
        </p>
      </header>

      <CameroonTopPlayersList blitz={data.blitz} rapid={data.rapid} />
    </PageShell>
  )
}
