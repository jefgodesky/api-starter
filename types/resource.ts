import type AuthTokenResource from './auth-token-resource.ts'
import type ProviderResource from './provider-resource.ts'
import type UserResource from './user-resource.ts'

type Resource =
  AuthTokenResource |
  ProviderResource |
  UserResource

export default Resource
