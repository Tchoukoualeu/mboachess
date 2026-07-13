import { createServerFn } from "@tanstack/react-start"
import { getContentCreators } from "@/lib/contentCreators"

export const loadContentCreators = createServerFn({ method: "GET" }).handler(
  async () => getContentCreators(),
)
