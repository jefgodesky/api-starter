import { BaseResource } from '../jsonapi.d.ts'
import AuthTokenAttributes from './auth-token-attributes.ts'

export default interface AuthTokenResource extends BaseResource {
  attributes: AuthTokenAttributes
}
