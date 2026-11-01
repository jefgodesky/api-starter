import { type Version } from '../version/types.ts'
import parseVersion from '../version/parse.ts'
import env from '../../env.ts'

const getRoot = (v?: Version): string => {
  const { path } = v ?? parseVersion()
  return [env.BASE_URL, path].join('/')
}

export default getRoot
