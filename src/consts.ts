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
export const VERSION = '0.1.6'

/** sha256 of rigseed_<VERSION>_aarch64.dmg, as `shasum -a 256` prints it. */
export const MAC_SHA = '21d1a5b140bb955f11dc34c2b230dd808ee60c7396d8f2aa915aeab13d61ef38'

/**
 * sha256 of rigseed_<VERSION>_x64-setup.exe.
 *
 * Uppercase because that is how Get-FileHash prints it, and the terminal on
 * the download page is meant to match what a person actually sees.
 */
export const WIN_SHA = 'CC90C1A1F8143A693B09FD3F9BC4F97011040FD0B9056AAD4CA4E09E8EB61E08'
