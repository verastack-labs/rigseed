/**
 * The changelog, taken from the releases rather than written twice.
 *
 * The notes on each GitHub release are already the canonical account of what
 * changed: they are what the release page shows and what the in-app updater
 * puts in front of somebody deciding whether to install. A second copy
 * maintained here would be correct exactly until the first time one of the two
 * is edited and the other is not.
 *
 * Fetched at build time, so visitors cost nothing and the page is static. The
 * trade is staleness: the site rebuilds on its own pushes, not when the app
 * releases, so `release.yml` pokes this repository afterwards to rebuild.
 */

/** The shape of a GitHub release, trimmed to what this page uses. */
export interface ApiRelease {
  tag_name: string
  name: string | null
  body: string | null
  draft: boolean
  prerelease: boolean
  published_at: string | null
  html_url: string
}

export interface ReleaseEntry {
  /** `0.1.3`, without the leading v, because the heading reads better. */
  version: string
  tag: string
  /** ISO 8601, or null for a release GitHub has not dated. */
  published: string | null
  /** The raw markdown body. Rendering is the page's job. */
  notes: string
  url: string
  prerelease: boolean
}

/**
 * Only the application's own releases, newest first.
 *
 * The sidecar is published to this same repository as `sidecar-5.2.3`, so an
 * unfiltered list puts a qbittorrent-nox build in the application's changelog.
 * Matching on a leading `v` and a digit is what separates them, and it is
 * deliberately strict: a tag nobody recognises is left out rather than guessed
 * at, because a changelog is a claim about what shipped.
 */
const APP_TAG = /^v\d+\.\d+\.\d+/

export function toEntries(releases: readonly ApiRelease[]): ReleaseEntry[] {
  return releases
    .filter((r) => !r.draft && APP_TAG.test(r.tag_name))
    .map((r) => ({
      version: r.tag_name.replace(/^v/, ''),
      tag: r.tag_name,
      published: r.published_at,
      notes: (r.body ?? '').trim(),
      url: r.html_url,
      prerelease: r.prerelease,
    }))
    .sort(compareVersionsDescending)
}

/**
 * Newest first, by version rather than by date.
 *
 * Dates are the obvious key and the wrong one: a release edited months later
 * keeps its publish date, but a patch cut from an older branch can be
 * published after a newer minor and would sort above it. The version is what
 * the ordering is actually about.
 */
function compareVersionsDescending(a: ReleaseEntry, b: ReleaseEntry): number {
  const left = a.version.split(/[.-]/).map(Number)
  const right = b.version.split(/[.-]/).map(Number)
  for (let i = 0; i < Math.max(left.length, right.length); i += 1) {
    const l = left[i]
    const r = right[i]
    // A missing or non-numeric part sorts last, so 0.2.0 beats 0.2.0-rc.1.
    const lv = Number.isFinite(l) ? (l as number) : -1
    const rv = Number.isFinite(r) ? (r as number) : -1
    if (lv !== rv) return rv - lv
  }
  return 0
}

/** `2 October 2026`, or null when GitHub has no date for it. */
export function formatReleaseDate(iso: string | null): string | null {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

/**
 * The placeholder the release workflow writes when it creates a draft.
 *
 * It reaches the page as a changelog entry saying nothing, so it is recognised
 * and treated as absent. Every published release should have had this replaced
 * by hand; one that still carries it is a release somebody forgot to write up,
 * and saying so is more useful than printing it.
 */
const PLACEHOLDER = 'Draft. Assets attached by the release workflow.'

export const hasRealNotes = (entry: ReleaseEntry): boolean =>
  entry.notes.length > 0 && entry.notes !== PLACEHOLDER

export interface FetchOptions {
  repo: string
  /** Passed in CI so the request is not rate limited by IP. */
  token?: string | undefined
  fetchImpl?: typeof fetch
}

/**
 * Fetches the releases, and is deliberately loud when it cannot.
 *
 * A changelog that silently renders empty is worse than one that fails the
 * build: the page still deploys, looks finished, and tells every visitor the
 * project has never shipped anything. The caller decides what to do with the
 * throw; the page fails the build in CI and falls back locally, where a
 * missing token is the ordinary case rather than a fault.
 */
export async function fetchReleases({
  repo,
  token,
  fetchImpl = fetch,
}: FetchOptions): Promise<ReleaseEntry[]> {
  const response = await fetchImpl(`https://api.github.com/repos/${repo}/releases?per_page=100`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (!response.ok) {
    throw new Error(
      `GitHub returned ${response.status} ${response.statusText} for ${repo} releases.` +
        (response.status === 403 ? ' That is usually the unauthenticated rate limit.' : ''),
    )
  }

  return toEntries((await response.json()) as ApiRelease[])
}
