import { parseIntOr } from '@revolutionarygamesco/common'
import { semverRegex, type SemVer, type Version } from '../schemas.ts'
import pkg from '../../../../package.json' with { type: 'json' }

const parseVersion = (v?: SemVer): Version => {
  const semver = v ?? pkg.version
  const matches = semver.match(semverRegex) ?? ['1.0.0', '1', '0', '0']

  const sem = matches[0] as SemVer
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
