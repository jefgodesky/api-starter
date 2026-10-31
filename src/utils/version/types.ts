export interface Version {
  sem: string
  major: number
  minor: number
  patch: number
  prerelease?: string
  build?: string
  path: string
}
