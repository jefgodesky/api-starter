export const API_VERSION = '1.0.0'

export const getAPIVersion = (
  version: string = API_VERSION,
): string => {
  const elems = version.split('.')
  return `v${elems[0]}`
}
