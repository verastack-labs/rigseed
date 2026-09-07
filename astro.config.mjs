// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'

// GitHub Pages serves this from the repository root of verastack-labs/rigseed,
// which is a project page, so the site lives under /rigseed rather than at the
// domain root. `base` has to match or every absolute asset path 404s once
// deployed while working perfectly in dev.
export default defineConfig({
  site: 'https://verastack-labs.github.io',
  base: '/rigseed',
  integrations: [
    react(),
    sitemap({
      // Without this the sitemap lists the same page twice, once as
      // /rigseed and once as /rigseed/, which is a duplicate-URL signal
      // for something that is one page. Keeping the trailing-slash form
      // matches what Astro emits as canonical.
      filter: (page) => page.endsWith('/'),
    }),
  ],
  // Static output. There is no server, and GitHub Pages could not run one.
  output: 'static',
})
