import { type Version } from '../../resources/version/schemas.ts'
import parseVersion from '../../resources/version/utils/parse.ts'
import env from '../../env.ts'

const getTestRoot = (v?: Version): string => {
  const { path } = v ?? parseVersion()
  return [`http://api:${env.PORT}`, path].join('/')
}

export default getTestRoot
