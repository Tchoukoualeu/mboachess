import { createFileRoute } from "@tanstack/react-router"
import { loadClubs } from "@/server/clubs"
import { ClubsPage, clubsHead } from "./clubs"

export const Route = createFileRoute("/en/clubs")({
  head: () => clubsHead("en"),
  loader: () => loadClubs(),
  component: ClubsPage,
})
