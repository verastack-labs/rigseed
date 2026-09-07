// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'

// GitHub Pages serves this from the repository root of verastack-labs/rigseed,
// which is a project page, so the site lives under /rigseed rather than at the
// domain root. `base` has to match or every absolute asset path 404s once
// deployed while working perfectly in dev.
export default defineConfig({
  site: 'https://verastack-labs.github.io',
  base: '/rigseed',
  integrations: [react()],
  // Static output. There is no server, and GitHub Pages could not run one.
  output: 'static',
})
