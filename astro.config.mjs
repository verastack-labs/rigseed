// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'

// The site has its own subdomain, so it is served from a domain root and
// needs no `base`. It used to live at verastack-labs.github.io/rigseed, where
// `base` had to match the repository name or every absolute asset path 404d
// in production while working perfectly in dev.
export default defineConfig({
  site: 'https://rigseed.verastack.dev',
  integrations: [
    react(),
    sitemap({
      // Without this the sitemap lists the same page twice, once with a
      // trailing slash and once without, which is a duplicate-URL signal
      // for something that is one page. Keeping the trailing-slash form
      // matches what Astro emits as canonical.
      filter: (page) => page.endsWith('/'),
    }),
  ],
  // Static output. There is no server, and GitHub Pages could not run one.
  output: 'static',
})
