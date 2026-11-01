import parseVersion from '../version/parse.ts'

const versionPath = (path: string): string => {
  const { path: version } = parseVersion()
  const elems = [version, path]
    .filter(el => el !== '/')
    .map(el => el.startsWith('/') ? el.substring(1) : el)
  return `/${elems.join('/')}`
}

export default versionPath
