# rigseed

Public landing page for **rigseed**, a desktop client for qBittorrent. Built with Astro and
served via GitHub Pages.

The app and its design system live in `verastack-labs/rigseed-app`.

## What rigseed is

A Tauri shell that launches `qbittorrent-nox` as a sidecar and drives it entirely over the
existing Web API v2.x. No C++/Qt is touched - it is a frontend replacement for a dated GUI,
plus a first-run experience and a theming layer the stock client does not have.

The design system is called **Cozy Terminal**: warm low-contrast neutrals, a user-chosen
accent that tints every surface rather than recolouring a few highlights, and monospace
reserved for data.

## Running it

    pnpm install
    pnpm run dev

The dev server serves at `http://localhost:4321/rigseed`. The `/rigseed` prefix is not
decoration: Pages serves this as a project page, so `base` in `astro.config.mjs` has to match
the repository name. Getting it wrong builds green, works in dev, and 404s every asset in
production, which is why the deploy workflow greps the built output for it.

    pnpm run build        # static output into dist/
    pnpm run preview      # serve dist/ as Pages will
    pnpm run format:check # CI runs this

## How the theme works

`src/styles/tokens.css` is a port of the canonical design foundations, not a re-derivation.
Two stages, exactly as the app does it: a mode-dependent base palette with per-mode tint
strengths, then the chosen accent mixed into every base tone through `color-mix`.

Mode and accent are attributes on the root element, so a theme change is one attribute write
and never a value computed in JavaScript. That is why the theming section can retint the whole
page: it is the same mechanism the app uses, not an imitation of it.

**The accent values are not written twice.** Each swatch carries its own `data-accent`, so the
dot inside it resolves `--accent` from the stylesheet. A swatch cannot disagree with the app's
palette because it never states a colour.

## Screenshots

`src/assets/screens/` holds real captures of the shipping app, taken against its built-in
sample data rather than a live daemon. That is deliberate. Screenshots of a real library on a
page for a torrent client advertise whatever is in it, and the sample data is what the product
brief describes anyway: Linux images, NASA photography, the Blender open movie collection.

The **Sample data** badge is visible in frame and stays there. It is true, and cropping it to
look like a live daemon would overclaim.

Captured at the 1440x900 design canvas at 2x. `astro:assets` emits webp and srcsets at build
time, which is why they live in `src/assets` rather than `public`.

## Structured data

`SoftwareApplication` and `Organization`, deliberately **without** `aggregateRating`. Google
lists a rating or review among the required properties, so this does not qualify for a rich
result. rigseed has no ratings and no reviews, and inventing one would both put a lie on the
page and break the rule that structured data must represent visible content.

## Licence

Apache License 2.0 - see `LICENSE`.

The app bundles `qbittorrent-nox`, which is GPL licensed. The corresponding source for the
exact build that ships is attached to every release in the app repository.

## Contact

- Project: verastack.labs@gmail.com
- Maintainer: therealriganb@gmail.com
