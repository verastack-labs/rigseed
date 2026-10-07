/**
 * Fails when src/consts.ts no longer describes the newest published release.
 *
 * The download page states a version and prints two checksums, and all three
 * are maintained by hand. That drifted at 0.1.3, and then again across 0.1.4
 * and 0.1.5, which shipped while the page still said 0.1.3. Nothing noticed,
 * because a stale constant builds green and serves a confident wrong answer.
 *
 * A wrong checksum is the worse half. A visitor who compares a printed hash
 * against their own download and finds it different concludes the file was
 * tampered with, which is the exact fear the page exists to settle.
 *
 * This is the same shape as the /rigseed base-path check: a failure that is
 * invisible in the build output and obvious in production, so it is worth a
 * step of its own in both CI and deploy.
 */
import { readFileSync } from 'node:fs'

const REPO = 'verastack-labs/rigseed-app'
const token = process.env.GITHUB_TOKEN

const read = (name, source) => {
  const m = source.match(new RegExp(`${name} = '([^']+)'`))
  if (!m) throw new Error(`could not find ${name} in src/consts.ts`)
  return m[1]
}

const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
}

const api = async (url) => {
  const r = await fetch(url, { headers })
  if (!r.ok) throw new Error(`${url} returned ${r.status}`)
  return r
}

const consts = readFileSync('src/consts.ts', 'utf8')
const version = read('VERSION', consts)
const macSha = read('MAC_SHA', consts)
const winSha = read('WIN_SHA', consts)

// The newest release GitHub considers latest, which is what the updater and
// the download links both resolve to. Drafts and prereleases are excluded by
// this endpoint, which is the behaviour we want.
const latest = await (await api(`https://api.github.com/repos/${REPO}/releases/latest`)).json()
const latestVersion = latest.tag_name.replace(/^v/, '')

const problems = []
if (version !== latestVersion) {
  problems.push(
    `VERSION is '${version}' but the newest release is '${latestVersion}'. ` +
      `Update src/consts.ts, including both checksums.`,
  )
}

// Checked against the .sha256 assets rather than recomputed, because those are
// what the release publishes and what a visitor is told to compare against.
const expected = [
  ['WIN_SHA', `rigseed_${latestVersion}_x64-setup.exe.sha256`, winSha],
  ['MAC_SHA', `rigseed_${latestVersion}_aarch64.dmg.sha256`, macSha],
]

for (const [name, assetName, actual] of expected) {
  const asset = latest.assets.find((a) => a.name === assetName)
  if (!asset) {
    problems.push(`${latestVersion} has no ${assetName}, so ${name} cannot be checked`)
    continue
  }
  const published = (await (await api(asset.browser_download_url)).text()).trim().split(/\s+/)[0]
  if (published.toLowerCase() !== actual.toLowerCase()) {
    problems.push(
      `${name} does not match ${assetName}:\n    site      ${actual}\n    published ${published}`,
    )
  }
}

if (problems.length > 0) {
  for (const p of problems) console.error(`::error::${p}`)
  process.exit(1)
}

console.log(`src/consts.ts matches ${latest.tag_name}: version and both checksums agree`)
