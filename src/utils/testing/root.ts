import { type Version } from '../../resources/version/schemas.ts'
import parseVersion from '../../resources/version/utils/parse.ts'
import getTestAuthority from './authority.ts'

const getTestRoot = (v?: Version): string => {
  const { path } = v ?? parseVersion()
  return [getTestAuthority(), path].join('/')
}

export default getTestRoot
