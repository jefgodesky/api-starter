import { API_VERSION } from '../version.ts'
import { getUnversionedRoot } from './root.ts'

const getUserAgent = (
  name?: string,
  version?: string,
  url?: string,
): string => {
  const n = name ?? Deno.env.get('API_NAME_MACHINE') ?? 'api-starter'
  const v = version ?? API_VERSION
  const u = url ?? getUnversionedRoot()
  return `${n}/v${v} (+${u})`
}

export default getUserAgent
