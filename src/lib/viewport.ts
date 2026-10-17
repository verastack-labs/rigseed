/**
 * Resize handling that ignores the mobile address bar.
 *
 * On Android Chrome the address bar hides as you scroll down and returns as
 * you scroll up. Each time, `window.innerHeight` changes by roughly 56px and a
 * `resize` event fires, without the page having been reflowed and without the
 * reader having done anything but change direction.
 *
 * Three scripts on this site read `innerHeight` to decide what is current: the
 * screen tour picks the active screen from a line at 45% of the viewport, the
 * statement lights its words from where the block sits in it, and the nav
 * takes its progress from the scrollable distance. All three recompute on
 * `resize`, so the bar moving silently moves the line, and the tour can swap
 * to a different screen while the reader is holding still. That is the "it
 * moves a little" people report, and it is not a layout shift: nothing has
 * changed size, the measurement underneath has.
 *
 * So these listeners want width changes, which are real layout events, and not
 * height-only ones, which on a phone are usually furniture. An orientation
 * change alters both and still gets through.
 *
 * Deliberately not `dvh` related. Nothing on this site is sized in `dvh`,
 * which is the unit that grows and shrinks with the bar; `vh` resolves against
 * the large viewport and holds still. Measured on all five pages: a 56px
 * height-only change moves nothing and leaves every document height identical.
 */

/**
 * Calls `handler` on resizes that change the viewport width.
 *
 * @param handler run on width changes, and once is not implied: call it
 *   yourself for the initial state, as these scripts already do.
 * @param signal aborts the listener, which is how every script here cleans up
 *   across a client-side navigation.
 */
export function onWidthResize(handler: () => void, signal: AbortSignal): void {
  let lastWidth = window.innerWidth

  window.addEventListener(
    'resize',
    () => {
      if (window.innerWidth === lastWidth) return
      lastWidth = window.innerWidth
      handler()
    },
    { signal },
  )
}
