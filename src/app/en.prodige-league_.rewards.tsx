import { createFileRoute } from "@tanstack/react-router"
import { loadProdigeRewardsPage } from "@/server/prodigeRewards"
import { ProdigeRewardsPageView, rewardsHead } from "./prodige-league_.rewards"

export const Route = createFileRoute("/en/prodige-league_/rewards")({
  head: () => rewardsHead("en"),
  loader: () => loadProdigeRewardsPage(),
  component: ProdigeRewardsPageView,
})
