import JSONAPI from './json-api.ts'
import ErrorObject from './error-object.ts'
import Links from './links.ts'
import Resource from './resource.ts'

export default interface Response {
  jsonapi: JSONAPI
  links: Links
  data?: Resource | Resource[]
  errors?: ErrorObject[]
  included?: Resource[]
}
