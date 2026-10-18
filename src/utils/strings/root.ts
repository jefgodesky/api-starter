import getAuthority from './authority.js'
import getVersion from './v.js'

const getRoot = (): string => {
  const a = getAuthority()
  const v = getVersion()
  return `${a}/${v}`
}

export default getRoot
