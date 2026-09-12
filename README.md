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

## The pages

Three of them, and the split is deliberate.

| Page         | Job                                                                                                                    |
| ------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `/`          | Make the case. Centred hero, the running transfer list, the theming demonstration, one close.                          |
| `/screens/`  | The depth. A sticky tour of the five real captures, then an index of all nine screens with their routes and endpoints. |
| `/download/` | Get the file. Real filenames, real verify commands, and each platform's warning where somebody will actually meet it.  |

The homepage is the category standard played straight, at the craft bar Linear
and Raycast set. That decision is recorded as a direction contract in an HTML
comment at the top of `<body>` in `Base.astro`, and the build is checked against
it rather than against taste. It survives into `dist/`, which is the point: a
contract the build erases is a contract nobody can audit.

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

Two files, and the division between them is the whole idea.

`src/styles/tokens.css` is a port of the canonical design foundations, not a re-derivation.
Two stages, exactly as the app does it: a mode-dependent base palette with per-mode tint
strengths, then the chosen accent mixed into every base tone through `color-mix`.

`src/styles/site-theme.css` overrides one thing: the base neutrals those stages mix into.
The app's are warm and deliberately low contrast, because somebody has that window open for
hours. A landing page is read once, quickly, often in daylight, and has about four seconds
to look like something, so the site takes a colder, deeper ground and brighter text.

**The eight accent hues are never touched.** The theming section demonstrates that those are
the app's real palette, and a site that quietly brightened them would be lying somewhere
nobody would think to check.

Mode and accent are attributes on the root element, so a theme change is one attribute write
and never a value computed in JavaScript. That is why the theming section can retint the whole
page: it is the same mechanism the app uses, not an imitation of it.

One consequence worth knowing before you debug it: the client router copies the incoming
document's `<html>` attributes over the live ones, which includes both of these. They are
reapplied on `astro:after-swap`, otherwise a chosen accent is lost the moment you open
another page.

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

The hero capture is shown whole and hinged along its top edge, lying back fourteen degrees at
rest and standing up as you scroll. It used to be cropped to 16/9, which cut the floating
action button off the bottom right corner: a real control, removed from a picture whose whole
argument is that it shows the real thing.

## Typography

Inter for sentences, JetBrains Mono for data, and **Yellowtail for the product's name and
nothing else** - in the wordmark and where the name appears in the headline. That rule is why
`.name-script` lives in `base.css` rather than in whichever component needed it first.

Anything set in the script is held invisible until Yellowtail has loaded, then revealed
together. The face ships with `font-display: swap`, so without this the name paints in a
fallback cursive and jumps, which on a word that distinctive is the first thing anyone sees
the site do. `visibility` rather than `display`, so the text keeps its box and nothing moves
while it waits, with a 1.5s deadline after which it shows regardless.

## Navigation

The bar is `transition:persist`ed through the client router, so it is the same live DOM node
across a navigation rather than being rebuilt. It contracts into a bordered glass pill once
content passes under it, and grows a Download button at roughly the moment the hero's copy of
that button leaves the screen.

Two things follow from persisting it, and both are easy to get wrong:

- The script runs **once for the session**. Anything page-dependent is recomputed on
  `astro:page-load`, including which link is current.
- Every _other_ component's script has the opposite problem. A module executes once, so
  anything set up at parse time stops initialising after the first client-side navigation.
  They all set up on `astro:page-load` with listeners bound to an `AbortController` that is
  torn down first.

## The social card

`public/social.png`, 1200x630, what every pasted link renders as.

It is built from `scratchpad/og/social.html` and captured in headless Chrome rather than
drawn as an SVG, because the wordmark is Yellowtail and the body is Inter, and every SVG
renderer to hand falls back to a system face instead. A social card in the wrong faces is
worse than none: it is the site's first impression everywhere the link is shared.

Two things that bit while making it, both worth knowing before regenerating it:

- **`--window-size` sizes the window, not the page.** At `1200,630` the viewport came out
  1182x534 and the footer, 56px off the bottom, fell outside the capture entirely. Set
  `Emulation.setDeviceMetricsOverride` instead.
- **`deviceScaleFactor` and the clip's `scale` multiply.** Both at 2 produced a 4800x2520
  file. Render at `deviceScaleFactor: 2` with `scale: 1`, then downscale to 1200x630.

The card repeats the dark palette as literals, because it renders standalone with no
stylesheet behind it. It is the one place in the project that does.

## Structured data

`SoftwareApplication` and `Organization`, deliberately **without** `aggregateRating`. Google
lists a rating or review among the required properties, so this does not qualify for a rich
result. rigseed has no ratings and no reviews, and inventing one would both put a lie on the
page and break the rule that structured data must represent visible content.

## Licence

Apache License 2.0 - see `LICENSE`.

The app bundles `qbittorrent-nox`, which is GPL licensed. Every release carries the source that
built the exact binary inside it, attached to the release page beside the installer.

That is a specific requirement rather than a courtesy. GPLv3 section 6 asks for the
_corresponding_ source, meaning the version, patches and build flags that produced that
particular file, offered from the same place as the binary. A link to upstream does not satisfy
it: upstream's current source is not what our binary was built from, since the version is pinned
to a commit and compiled with our own flags. The release workflow refuses to publish without the
archive for this reason.

## Contact

- Project: verastack.labs@gmail.com
- Maintainer: therealriganb@gmail.com
