import { BaseResource } from '../jsonapi.d.ts'
import UserAttributes from './user-attributes.ts'

export default interface UserResource extends BaseResource {
  attributes: UserAttributes
}
