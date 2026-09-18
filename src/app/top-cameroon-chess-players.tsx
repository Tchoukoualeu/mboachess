import { createFileRoute } from "@tanstack/react-router"
import { CameroonTopPlayersList } from "@/components/CameroonTopPlayersList"
import { PageShell } from "@/components/PageShell"
import { pageHead, webPageJsonLd } from "@/lib/seo"
import { loadCameroonTopPlayers } from "@/server/cameroonTopPlayers"

const TITLE = "Top 100 Cameroon Chess.com Players | Blitz & Rapid"
const DESCRIPTION =
  "See the 100 highest-rated Cameroonian Chess.com players in live blitz and rapid. Browse the leaderboard with load more."

export const Route = createFileRoute("/top-cameroon-chess-players")({
  head: () =>
    pageHead({
      title: TITLE,
      description: DESCRIPTION,
      path: "/top-cameroon-chess-players",
      jsonLd: webPageJsonLd({
        title: TITLE,
        description: DESCRIPTION,
        path: "/top-cameroon-chess-players",
      }),
    }),
  loader: () => loadCameroonTopPlayers(),
  component: TopPlayersPage,
})

function TopPlayersPage() {
  const data = Route.useLoaderData()

  return (
    <PageShell>
      <header className="mb-6 sm:mb-8">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
          Top Cameroon players
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
          The 100 best Cameroon Chess.com players by live blitz and rapid
          rating. Switch between lists and use load more to browse the full
          ranking.
        </p>
      </header>

      <CameroonTopPlayersList blitz={data.blitz} rapid={data.rapid} />
    </PageShell>
  )
}
