import { createFileRoute } from "@tanstack/react-router"
import { localizePath } from "@/lib/i18n"
import { PUBLIC_ROUTES } from "@/lib/seo"

const BASE_URL = "https://mboachess.com"

function absolute(path: string): string {
  return `${BASE_URL}${path}`
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const now = new Date().toISOString()
        const urls = PUBLIC_ROUTES.flatMap(({ path, changefreq, priority }) => {
          const french = localizePath(path, "fr")
          const english = localizePath(path, "en")
          const alternates = `    <xhtml:link rel="alternate" hreflang="fr" href="${absolute(french)}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${absolute(english)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${absolute(french)}"/>`
          return [french, english].map(
            (loc) => `  <url>
    <loc>${absolute(loc)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${alternates}
  </url>`,
          )
        }).join("\n")

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`

        return new Response(xml, {
          headers: { "Content-Type": "application/xml" },
        })
      },
    },
  },
})
