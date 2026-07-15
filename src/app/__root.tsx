import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router"
import appCss from "./globals.css?url"
import { pageHead } from "@/lib/seo"

export const Route = createRootRoute({
  head: () => {
    const seo = pageHead({
      title: "Mboachess - Chess in Cameroon | Players, Clubs & Tournaments",
      description:
        "The hub for chess in Cameroon. Track Cameroonian chess players' ratings, discover local chess clubs, view upcoming tournaments, and connect with the chess community across Cameroon.",
      path: "/",
    })

    return {
      meta: [
        { charSet: "utf-8" },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        ...seo.meta,
      ],
      links: [{ rel: "icon", href: "/queen.png", type: "image/png" }, { rel: "stylesheet", href: appCss }, ...seo.links],
    }
  },
  component: RootLayout,
})

function RootLayout() {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-full flex flex-col">
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}
