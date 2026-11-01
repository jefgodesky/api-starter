import { parseIntOr } from '@revolutionarygamesco/common'
import { type Version } from './types.ts'
import pkg from '../../../package.json' with { type: 'json' }

// From https://semver.org/
export const semverRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/

const parseVersion = (v?: string): Version => {
  const semver = v ?? pkg.version
  const matches = semver.match(semverRegex) ?? ['1.0.0', '1', '0', '0']

  const sem = matches[0]
  const major = parseIntOr(matches[1], 1)
  const minor = parseIntOr(matches[2], 0)
  const patch = parseIntOr(matches[3], 0)
  const path = `v${major}`

  const obj: Version = { sem, major, minor, patch, path }
  if (matches[4]) obj.prerelease = matches[4]
  if (matches[5]) obj.build = matches[5]

  return obj
}

export default parseVersion
