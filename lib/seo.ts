const SITE_URL = "https://mboachess.com"
const SITE_NAME = "mboachess"
const OG_IMAGE = `${SITE_URL}/og.png`

type PageSeo = {
  title: string
  description: string
  path: string
  type?: "website" | "article"
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

export function pageHead({
  title,
  description,
  path,
  type = "website",
  jsonLd,
}: PageSeo) {
  const url = `${SITE_URL}${path}`

  const scripts = jsonLd
    ? [
        {
          type: "application/ld+json",
          children: JSON.stringify(jsonLd),
        },
      ]
    : []

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:type", content: type },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts,
  }
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "The hub for chess in Cameroon. Track players, clubs, tournaments, and the community.",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/queen.png`,
    },
  }
}

export function webPageJsonLd({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${SITE_URL}${path}`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  }
}

export const PUBLIC_ROUTES = [
  { path: "/", changefreq: "daily", priority: "1" },
  { path: "/chess-cameroon", changefreq: "weekly", priority: "0.8" },
  { path: "/tournaments", changefreq: "daily", priority: "0.7" },
  { path: "/tournaments/past-online", changefreq: "weekly", priority: "0.6" },
  { path: "/clubs", changefreq: "weekly", priority: "0.7" },
  { path: "/content-creators", changefreq: "weekly", priority: "0.7" },
  { path: "/rating-speed-run", changefreq: "daily", priority: "0.7" },
] as const

export { SITE_URL, SITE_NAME, OG_IMAGE }
