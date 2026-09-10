import getEnvNumber from './get-env-num.ts'
import { getAPIVersion } from '../version.ts'

export const getUnversionedRoot = (): string => {
  const protocol = Deno.env.get('API_PROTOCOL') ?? 'https'
  const domain = Deno.env.get('API_DOMAIN') ?? 'api.example.com'
  const port = getEnvNumber('PORT', 80)

  return port === 80
    ? `${protocol}://${domain}`
    : `${protocol}://${domain}:${port}`
}

const getRoot = (): string => {
  return [getUnversionedRoot(), getAPIVersion()].join('/')
}

export default getRoot
