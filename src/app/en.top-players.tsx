import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/en/top-players")({
  beforeLoad: () => {
    throw redirect({ href: "/en/top-cameroon-chess-players" })
  },
})
