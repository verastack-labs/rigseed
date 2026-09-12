# DESIGN.md

The visual system of the rigseed site, written from the built site rather than from intention.
Where this disagrees with the code, the code is right and this file is stale.

The app has its own foundations, held in the app repository. This file covers only the
marketing site, and says explicitly where the two diverge.

## The direction

The homepage is **the category standard played straight**, at the craft bar set by Linear and
Raycast. That was a deliberate choice over six other derived directions and a rolled
assignment, taken because the audience is technical and arrives expecting a tool rather than
an art piece.

The contract is recorded as an HTML comment at the top of `<body>` in `src/layouts/Base.astro`
and survives into `dist/`. It is the thing to read before changing anything here, and the
thing to check a change against.

Playing a convention straight is not permission to be generic. The commitment shows up as
craft rather than as novelty: hairlines instead of cards, real product surfaces instead of
abstractions, measured rather than assumed values, and exactly one characterful gesture.

## Colour

Two files, and the split between them is load-bearing.

**`src/styles/tokens.css`** is a port of the app's canonical foundations. Two stages: a
mode-dependent base palette with per-mode tint strengths, then the chosen accent mixed into
every base tone with `color-mix`.

**`src/styles/site-theme.css`** overrides exactly one thing, the base neutrals those stages
mix into.

|              | App             | Site                   |
| ------------ | --------------- | ---------------------- |
| Ground, dark | `#191a1c`, warm | `#05080e`, blue-biased |
| Text, dark   | `#e9e8e6`       | `#f8fafd`              |
| Border, dark | `#34373c`       | `#35435c`              |
| Ground tint  | 7%              | 4%                     |
| Surface tint | 8%              | 10%                    |

The reason is situational rather than aesthetic. The app's neutrals are warm and deliberately
low contrast because somebody has that window open for hours, and a high-contrast surface is
tiring to sit in front of. The site is read once, quickly, often in daylight on a phone, and
has a few seconds to look like something.

Two rules that must not be broken:

- **The eight accent hues are never redefined.** The theming section demonstrates that those
  are the app's real palette. A site that quietly brightened them would be lying somewhere no
  reader would think to check.
- **Never write a colour literal in a component.** Every colour resolves from a token, which
  is what lets the whole page retint from one attribute write.

The colour strategy is restrained: neutrals plus one accent. The accent is chosen by the
reader, so the design cannot depend on any particular hue. That is a real constraint and it
rules out anything keyed to a specific colour relationship.

## Type

| Role                                                      | Face                    |
| --------------------------------------------------------- | ----------------------- |
| Headings, `h1` to `h3`                                    | Archivo 600, `-0.033em` |
| Sentences and interface                                   | Inter Variable          |
| Data: sizes, speeds, ratios, hashes, endpoints, filenames | JetBrains Mono          |
| The product's name, and nothing else                      | Yellowtail              |

**Headings are Archivo, sentences are Inter, and the split is deliberate.** The app uses Inter
throughout and the site keeps it for body copy, because the two should read as one product. But
the app never made a _display_ decision, so that one is the site's to make. Inter at a headline
size is body copy enlarged: drawn to be invisible, which is exactly right for a paragraph and
exactly wrong for the one line somebody reads first. Archivo has squarer counters and takes a
much tighter fit at large sizes without the letters colliding.

The tracking is the other half. `-0.02em` is the safe default; `-0.033em` is what the craft bar
this site was measured against actually sets, and the difference between the two is most of why
a headline reads as considered rather than as a default.

**Monospace means data** is inherited from the app and kept. A number, a path or a filename
not set in mono is a bug.

**Yellowtail is reserved for the name.** It appears in the wordmark and wherever the word
"rigseed" appears in running text, currently the second line of the hero. Nowhere else, ever,
and the rule follows the name rather than the position. This is the single characterful
gesture in the system and it stops working the moment it is spent on something else. The rule
lives in `base.css` as `.name-script` rather than in any one component, because it is a rule
about the whole site.

Anything set in the script is held invisible until Yellowtail has loaded, then revealed.
`visibility`, not `display` or `opacity`, so the text keeps its box and nothing moves while it
waits, with a 1.5 second deadline after which it shows in the fallback regardless.

A script face carries a much smaller x-height than a grotesque at the same point size, so it
is set at `1.24em` and nudged down to put its x-height and baseline where the surrounding line
already is.

## Structure

**Hairlines, not cards.** Border, fill, radius and shadow each say "separate object" and are
spent by role. Three points of one argument share a rule and are divided by one; three
genuinely separate download targets are cards. If everything on a page has the same border and
radius, the hierarchy has been flattened.

**Shadow means the thing floats.** The hero surface and the contracted nav pill have shadows.
Nothing else does.

**No kickers.** A small uppercase label above a heading is banned outright. It repeats what the
heading already says, in a size nobody reads, and it is the most reliable single tell of a page
assembled from a template. Eight of them shipped before the finish review caught them, and the
`eyebrow` prop came off `PageHead` with them so no caller can reintroduce one.

The `.eyebrow` class survives for one job: naming a list, in the footer's columns. A label that
titles a set of links is a heading. A label that titles a heading is a kicker.

**The aura is the homepage's opening and closing move.** An accent-tinted radial behind the
hero and behind the close, mixed from the live accent token so it retints with everything
else. It appears on no other page, deliberately: repeating it on every utility page spends it
until it means nothing.

| Radius            | Use                                            |
| ----------------- | ---------------------------------------------- |
| `--r-control` 8px | buttons, inputs                                |
| `--r-nav` 9px     | nav links, the sliding indicator               |
| `--r-card` 12px   | cards, framed images                           |
| `999px`           | pills, the contracted nav, the accent swatches |

## Motion

Motion is authored once per idea and orchestrated, rather than scattered across hover states.

| Where           | What                                                         | Why it exists                                                       |
| --------------- | ------------------------------------------------------------ | ------------------------------------------------------------------- |
| Nav             | Contracts into a glass pill past 32px of scroll              | Grows the primary action as the hero's copy of it leaves the screen |
| Nav indicator   | Slides between links on hover, returns to the current page   | Borrowed from the app's own View control                            |
| Hero surface    | Hinged at its top edge, 14 degrees at rest, upright by 420px | Gives the first screen something to do without cropping the capture |
| Theming         | A guided pointer arcs to two swatches and clicks them        | The swatch row reads as a legend until something moves              |
| Download cards  | A pointer-tracked gradient border                            | Makes a static grid feel addressable                                |
| Hero background | Eleven recycling glyph sprites                               | Atmosphere, in the product's own iconography                        |
| Pipeline        | A gradient pulse travelling each wire                        | The two directions are the two protocols, not variety               |
| Statement       | One sentence lit word by word on scroll                      | Emphasis on the page's whole argument, said once                    |
| Terminal        | Install output revealed line by line                         | Pacing, so the commands read in the order you would run them        |
| Comparison      | A draggable divider between two captures                     | The strongest argument the project has, and it needs no copy        |

**Every one of these is off or static under `prefers-reduced-motion`,** and the information
each carries survives. The nav still changes state, the progress line still fills, the sprites
are still there. State changes; it just does not travel to get there.

**Nothing is hidden waiting to be revealed.** Sections animate from a visible resting state or
not at all. A page whose first viewport is blank until you scroll has not loaded, it has
armed.

This one is easy to get backwards, and it was, twice in one branch. The rule in practice: a
reveal has to **opt an element into being hidden** before it may hide it, rather than the
stylesheet hiding everything and the script revealing it. The terminal's lines are visible
until its own script adds `is-armed`; the statement's words rest at a legible dim rather than
at zero. Written the other way round, both are blank to anyone with scripting off and in the
still frame a shared link renders from.

## Behaviour

The site runs Astro's `ClientRouter`, so it behaves as one shell swapping its contents rather
than as a set of separate documents. Two consequences, both easy to get wrong:

1. **The nav is `transition:persist`ed.** Its script runs once for the whole session, so
   anything page-dependent is recomputed on `astro:page-load`.
2. **Every other component's script also runs once,** which means anything wired at parse time
   silently stops working after the first client-side navigation. They all set up on
   `astro:page-load`, with listeners bound to an `AbortController` that is torn down first.

The router copies the incoming document's `<html>` attributes over the live ones, including
`data-mode` and `data-accent`, so the theme is reapplied on `astro:after-swap`.

**Vendor prefixes go first, the standard property last.** The minifier treats a prefixed and
unprefixed pair as one property and keeps the last declaration, so writing the standard
property first means it is the one discarded. This shipped once: the nav pill went out with
`-webkit-backdrop-filter` only and no blur at all. The dev server does not minify, so it looked
correct locally every time. **Check the built stylesheet, not the source.**

## Honesty rules

These are design constraints rather than editorial preferences, and each has already caused
work to be thrown away.

- **Screenshots are the real app against its built-in sample data,** with the "Sample data"
  badge visible in frame. Never a real library, never a mockup presented as a capture.
- **Never crop a real control out of a screenshot.** The hero was cropped to 16/9 and it
  removed the floating action button. That was the wrong trade, and it is why the capture is
  tilted rather than cropped.
- **Every stated fact is checked against the app,** not written for the page. The keyboard
  shortcuts come from `transfers.tsx`, the endpoints from the screen specifications, the
  credential generation from `daemon.rs`.
- **Warnings are blunt and sit where they will be met:** unsigned builds, the untested macOS
  build, the glibc floor.
- **No invented numbers.** No rating in the structured data, no user counts, no benchmarks.
- **A comparison shares one frame, or it is not a comparison.** Both halves of the before and
  after are cropped to the same 16:10 and resized to the same 1600x1000. Left at their native
  1.653 and 1.600, one side would be stretched relative to the other and part of every
  difference a reader saw would be that rather than the design. The stock capture is a real
  client on a throwaway profile with its version visible, never a mock and never retouched.

## What is not here yet

- Light mode is implemented and correct but has had far less scrutiny than dark.
- Two findings from the finish review stay open by decision rather than by oversight: the hero
  still prints its endpoint line, and the Download page is still built on cards rather than
  hairlines. Both are argued for above; neither is an accident.
