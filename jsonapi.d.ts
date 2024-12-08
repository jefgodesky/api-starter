import type AuthTokenResource from './types/auth-token-resource.ts'
import type UserResource from './types/user-resource.ts'

type Resource = AuthTokenResource | UserResource

interface LinkObject {
  href: string
  rel?: string
  describedBy?: string
  title?: string
  type?: string
  hreflang?: string
}

interface Links {
  self: LinkObject | string
  related?: LinkObject | string
  describedBy?: LinkObject | string
  [key: string]: LinkObject | string | undefined
}

interface PaginatedLinks extends Links {
  first: string
  prev: string
  next: string
  last: string
}

interface BaseResource {
  type: string
  id: string
  links?: Links
}

interface JSONAPI {
  version: string
  ext?: string[]
  profile?: string[]
}

interface Response {
  jsonapi: JSONAPI
  links: Links
  data?: Resource | Resource[]
  included?: Resource[]
}
