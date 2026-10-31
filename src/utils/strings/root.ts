import getAuthority from './authority.js'
import parseVersion from '../../resources/version/utils/parse.ts'

const getRoot = (): string => {
  const authority = getAuthority()
  const { path } = parseVersion()
  return [authority, path].join('/')
}

export default getRoot
