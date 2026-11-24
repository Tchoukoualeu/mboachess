import { Outlet, createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/en/rating-speed-run")({
  component: EnglishSpeedRunLayout,
})

function EnglishSpeedRunLayout() {
  return <Outlet />
}
