import path from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { nitro } from "nitro/vite"

const root = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": root,
    },
    tsconfigPaths: true,
  },
  ssr: {
    // Keep mongodb as a real Node module. Bundling it breaks at runtime
    // because its CJS internals call `require()` inside an ESM output.
    external: ["mongodb"],
  },
  plugins: [
    tailwindcss(),
    tanstackStart({
      srcDirectory: "src",
      router: {
        routesDirectory: "app",
      },
    }),
    viteReact(),
    nitro({
      config: {
        // Nitro 3 bundles dependencies unless they are traced. Bundling
        // mongodb turns its runtime `require("crypto")` into a broken ESM
        // call, which fails SCRAM-SHA-1 auth on the homepage loader.
        traceDeps: ["mongodb*"],
      },
    }),
  ],
})
