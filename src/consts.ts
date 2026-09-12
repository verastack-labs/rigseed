/**
 * The release the site describes.
 *
 * One place, because this used to be three: every page declared its own
 * `const version` and Terminal.astro carried the checksums separately. Cutting
 * 0.1.3 drifted all five at once, and the checksums are the half that matters.
 * A visitor comparing a printed hash against their own download and finding it
 * different concludes the file was tampered with, which is the exact fear this
 * page exists to answer. Wrong is worse than absent here.
 *
 * When the app releases, this file changes and nothing else does. The hashes
 * are the real published ones, copied from the `.sha256` assets on the release.
 */
export const VERSION = '0.1.3'

/** sha256 of rigseed_<VERSION>_aarch64.dmg, as `shasum -a 256` prints it. */
export const MAC_SHA = 'f86ad533355dac524e404a1097d355457a1d945134ef5082a473fecda7681ffe'

/**
 * sha256 of rigseed_<VERSION>_x64-setup.exe.
 *
 * Uppercase because that is how Get-FileHash prints it, and the terminal on
 * the download page is meant to match what a person actually sees.
 */
export const WIN_SHA = 'AA5F5A464DA2AD63BDB5DE6598965D85356DB43339D1FC106B8567D8B590EAE1'
