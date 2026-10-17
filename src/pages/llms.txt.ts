import type { APIRoute } from 'astro'

import { VERSION } from '../consts'

/**
 * `/llms.txt`, a short plain-text description of rigseed for language models.
 *
 * A proposed convention rather than a standard anybody has agreed to, so no
 * engine promises to read it. It costs a few hundred words and it is the one
 * thing our own AI search check marks the site down for, which is reason
 * enough.
 *
 * Generated rather than written into `public/`, and the reason is on record:
 * cutting 0.1.3 left this site advertising 0.1.2 because the version lived in
 * four files. It lives in `consts.ts` now, and anything that repeats it reads
 * it from there. A static llms.txt would be a fifth copy of the number, stale
 * within one release and wrong in a file nobody thinks to check.
 *
 * `prerender` is explicit because this is a route that emits a file rather
 * than a page, and the site builds to static output: without it an endpoint
 * is the one thing that can silently stop being written.
 */
export const prerender = true

const SITE = 'https://rigseed.verastack.dev'
const REPO = 'https://github.com/verastack-labs/rigseed-app'

const body = `# rigseed

> A desktop client for qBittorrent that brings its own daemon, so there is nothing to install or configure first.

rigseed is a free and open source desktop application for Windows, macOS and
Linux. It ships a bundled qbittorrent-nox, which means a working torrent client
out of the box, and it can also connect to a qBittorrent daemon you already
run. The interface is the point: three layouts, a token-based theming layer
with eight accents, and plain language instead of BitTorrent vocabulary.

Current version ${VERSION}. The app is licensed Apache-2.0; the bundled
qbittorrent-nox is GPL-3.0 and every release carries the source that built it.
There is no paid tier, no account and no telemetry.

macOS builds are Apple Silicon only. Linux ships a .deb, a .rpm and an
AppImage, built against glibc 2.35, which covers Ubuntu 22.04 and newer and
Debian 12 and newer.

## Links

- [Home](${SITE}/): what rigseed is, and the interface in one screen
- [Screens](${SITE}/screens/): the three layouts and the theming, in depth
- [Download](${SITE}/download/): installers for all three platforms, with a checksum for each
- [Changelog](${SITE}/changelog/): every released version, taken from the release notes themselves
- [Privacy](${SITE}/privacy/): what leaves your machine, including an honest answer about what BitTorrent reveals
- [Source](${REPO}): the application repository
- [Releases](${REPO}/releases): downloads and notes for every version
- [Made by VeraStack Labs](https://verastack.dev)
`

export const GET: APIRoute = () =>
  new Response(body, {
    headers: {
      // Only the dev server reads this. A static build writes dist/llms.txt
      // and throws the headers away, so in production the extension decides,
      // and GitHub Pages already serves this site's robots.txt as
      // text/plain; charset=utf-8. It is set anyway so that running the site
      // and deploying it do not disagree, which is the kind of difference
      // that is only ever noticed by the thing it breaks.
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
