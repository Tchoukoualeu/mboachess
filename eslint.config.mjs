import { defineConfig, globalIgnores } from "eslint/config"
import js from "@eslint/js"
import tseslint from "typescript-eslint"

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  globalIgnores([".output/**", "node_modules/**", "src/routeTree.gen.ts"]),
])
