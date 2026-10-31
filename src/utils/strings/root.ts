import getAuthority from './authority.js'
import { type Version } from '../version/types.ts'
import parseVersion from '../version/parse.ts'

const getRoot = (v?: Version): string => {
  const authority = getAuthority()
  const { path } = v ?? parseVersion()
  return [authority, path].join('/')
}

export default getRoot
