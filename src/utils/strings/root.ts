import getAuthority from './authority.js'
import { type Version } from '../../resources/version/schemas.ts'
import parseVersion from '../../resources/version/utils/parse.ts'

const getRoot = (v?: Version): string => {
  const authority = getAuthority()
  const { path } = v ?? parseVersion()
  return [authority, path].join('/')
}

export default getRoot
