import type UserResource from './types/user-resource.ts'

type Resource = UserResource

interface Links {
  self: string
  related?: string
  describedBy?: string
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
