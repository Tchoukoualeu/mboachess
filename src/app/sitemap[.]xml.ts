import { createFileRoute } from "@tanstack/react-router"
import { PUBLIC_ROUTES } from "@/lib/seo"

const BASE_URL = "https://mboachess.com"

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const now = new Date().toISOString()
        const urls = PUBLIC_ROUTES.map(
          ({ path, changefreq, priority }) => `  <url>
    <loc>${BASE_URL}${path === "/" ? "/" : path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
        ).join("\n")

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

        return new Response(xml, {
          headers: { "Content-Type": "application/xml" },
        })
      },
    },
  },
})
