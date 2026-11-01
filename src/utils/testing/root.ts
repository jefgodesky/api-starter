import { type Version } from '../version/types.ts'
import parseVersion from '../version/parse.ts'
import env from '../../env.ts'

const getTestRoot = (v?: Version): string => {
  const { path } = v ?? parseVersion()
  const { port } = new URL(env.BASE_URL)
  return `http://api:${port}/${path}`
}

export default getTestRoot
