import parseVersion from '../../resources/version/utils/parse.ts'

const versionPath = (path: string): string => {
  const { path: version } = parseVersion()
  const elems = [version, path].filter(el => el !== '/')
  return `/${elems.join('/')}`
}

export default versionPath
