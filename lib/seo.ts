const SITE_URL = "https://mboachess.com"
const SITE_NAME = "mboachess"

type PageSeo = {
  title: string
  description: string
  path: string
  type?: "website" | "article"
}

export function pageHead({ title, description, path, type = "website" }: PageSeo) {
  const url = `${SITE_URL}${path}`

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:type", content: type },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: url }],
  }
}

export const PUBLIC_ROUTES = [
  { path: "/", changefreq: "daily", priority: "1" },
  { path: "/chess-cameroon", changefreq: "weekly", priority: "0.8" },
  { path: "/tournaments", changefreq: "daily", priority: "0.7" },
  { path: "/clubs", changefreq: "weekly", priority: "0.7" },
  { path: "/content-creators", changefreq: "weekly", priority: "0.7" },
] as const
