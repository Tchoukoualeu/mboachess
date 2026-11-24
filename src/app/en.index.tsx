import { createFileRoute } from "@tanstack/react-router"
import { loadHomeData } from "@/server/home"
import { Home, homeHead } from "./index"

export const Route = createFileRoute("/en/")({
  head: () => homeHead("en"),
  loader: () => loadHomeData(),
  component: Home,
})
