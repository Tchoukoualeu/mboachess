import type { MetadataRoute } from "next"

function getSiteUrl(): string {
  const explicit =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
    process.env.VERCEL_URL

  if (explicit && /^https?:\/\//i.test(explicit)) return explicit.replace(/\/+$/, "")
  if (explicit) return `https://${explicit}`.replace(/\/+$/, "")

  return "https://mboachess.com"
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl()
  const now = new Date()

  return [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/chess-cameroon`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ]
}
