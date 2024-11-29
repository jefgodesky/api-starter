import getEnvNumber from './get-env-number.ts'

const getPrefix = (collection: string): string => {
  const version = getEnvNumber('API_VERSION', 1)
  return `/v${version}/${collection}`
}

export default getPrefix
