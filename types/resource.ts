import type AuthTokenResource from './auth-token-resource.ts'
import type ProviderResource from './provider-resource.ts'
import UserResource, { createUserResource } from './user-resource.ts'

type Resource =
  AuthTokenResource |
  ProviderResource |
  UserResource

const createResource = (overrides?: Partial<Resource>): Resource => {
  const defaultResource: Resource = createUserResource()
  return { ...defaultResource, ...overrides } as Resource
}

export default Resource
export { createResource }
