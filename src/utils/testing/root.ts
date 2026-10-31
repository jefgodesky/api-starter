import { type Version } from '../version/types.ts'
import parseVersion from '../version/parse.ts'
import getTestAuthority from './authority.ts'

const getTestRoot = (v?: Version): string => {
  const { path } = v ?? parseVersion()
  return [getTestAuthority(), path].join('/')
}

export default getTestRoot
