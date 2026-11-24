import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router"
import appCss from "./globals.css?url"
import { SiteFooter } from "@/components/SiteFooter"
import { SiteHeader } from "@/components/SiteHeader"
import { localeFromPath } from "@/lib/i18n"
import { websiteJsonLd } from "@/lib/seo"

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&display=swap"

export const Route = createRootRoute({
  head: ({ matches }) => {
    const pathname = matches[matches.length - 1]?.pathname ?? "/"
    const locale = localeFromPath(pathname)
    return {
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
    ],
    links: [
      { rel: "icon", href: "/queen.png", type: "image/png" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      { rel: "stylesheet", href: FONT_HREF },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(websiteJsonLd(locale)),
      },
    ],
  }
  },
  component: RootLayout,
})

function RootLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const locale = localeFromPath(pathname)

  return (
    <html lang={locale} className="h-full antialiased">
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-full flex-col font-sans text-foreground">
        <SiteHeader />
        <Outlet />
        <SiteFooter />
        <Scripts />
      </body>
    </html>
  )
}
