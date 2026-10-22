import getVersion from './v.js'

const versionPath = (path: string): string => {
  const elems = [getVersion(), path].filter(el => el !== '/')
  return `/${elems.join('/')}`
}

export default versionPath
