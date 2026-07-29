import { Outlet, createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/rating-speed-run")({
  component: RatingSpeedRunLayout,
})

function RatingSpeedRunLayout() {
  return <Outlet />
}
