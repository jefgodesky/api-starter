import env from '../../env.js'

const getVersion = (
  version: string = env.API_VERSION
): string => {
  const elems = version.split('.')
  return `v${elems[0] ?? '1'}`
}

export default getVersion
