import { createFileRoute } from "@tanstack/react-router"
import { loadContentCreators } from "@/server/contentCreators"
import { ContentCreatorsPage, creatorsHead } from "./content-creators"

export const Route = createFileRoute("/en/content-creators")({
  head: () => creatorsHead("en"),
  loader: () => loadContentCreators(),
  component: ContentCreatorsPage,
})
