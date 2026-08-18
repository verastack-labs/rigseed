# rigseed

Public landing page for **rigseed**, a desktop client for qBittorrent. Served via
GitHub Pages.

> **Not built yet.** The landing page is not designed, so this repo holds the product
> brief and nothing else for now. The app and its design system live in
> `verastack-labs/rigseed-app`; planning and canonical design foundations live in
> `verastack-labs/rigseed-internal`.

## What rigseed is

A Tauri shell that launches `qbittorrent-nox` as a sidecar and drives it entirely over
the existing Web API v2.x. No C++/Qt is touched — it is a frontend replacement for a
dated GUI, plus a first-run experience and a theming layer the stock client does not
have.

The design system is called **Cozy Terminal**: warm low-contrast neutrals, a user-chosen
accent that tints every surface rather than recolouring a few highlights, and monospace
reserved for data.

## When this gets built

Design foundations come from `rigseed-internal/docs/design-foundations.md`. This repo
will carry its own `DESIGN.md` with frontmatter mirroring the shared values, with
sections tagged `[shared]` and `[site]`.
