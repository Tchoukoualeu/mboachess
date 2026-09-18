import { createFileRoute, redirect } from "@tanstack/react-router"

/** Old path kept so bookmarks and early links keep working. */
export const Route = createFileRoute("/top-players")({
  beforeLoad: () => {
    throw redirect({
      to: "/top-cameroon-chess-players",
    })
  },
})
