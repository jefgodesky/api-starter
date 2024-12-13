import type BaseResource from './base-resource.ts'
import UserAttributes from './user-attributes.ts'

export default interface UserResource extends BaseResource {
  attributes: UserAttributes
}
