import { Outlet, createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/en")({
  component: EnglishLayout,
})

function EnglishLayout() {
  return <Outlet />
}
