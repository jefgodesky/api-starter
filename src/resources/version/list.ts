import {
  type SemVer,
  type VersionStatus,
  type VersionResponse,
  type VersionResponses
} from './schemas.ts'
import getRoot from '../../utils/strings/root.ts'
import parseVersion from './utils/parse.ts'

interface VersionInfo {
  version: SemVer
  status: VersionStatus
}

const futureVersions: VersionInfo[] = []
const pastVersions: VersionInfo[] = []

/**
 * Example:
 * futureVersions: VersionInfo[] = [
 *   { version: '2.0.0-alpha', status: 'alpha' }
 * ]
 *
 * pastVersions: VersionInfo[] = [
 *   { version: '1.0.0', status: 'legacy' },
 *   { version: '0.9.37', status: 'retired' }
 * ]
 */

const infoToResponse = (info: VersionInfo): VersionResponse => {
  const { version, status } = info
  const v = parseVersion(version)
  return { version, uri: getRoot(v), status }
}

const listVersions = (): VersionResponses => {
  const v = parseVersion()
  const present = infoToResponse({ version: v.sem, status: 'live' })
  const future = futureVersions.map(infoToResponse)
  const past = pastVersions.map(infoToResponse)
  return [...future, present, ...past]
}

export default listVersions
