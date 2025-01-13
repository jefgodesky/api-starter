import type BaseResource from './base-resource.ts'
import UserAttributes, { createUserAttributes } from './user-attributes.ts'

export default interface UserResource extends BaseResource {
  attributes?: UserAttributes
}

const createUserResource = (overrides?: Partial<UserResource>): UserResource => {
  const defaultUserResource: UserResource = {
    type: 'users',
    id: crypto.randomUUID(),
    attributes: createUserAttributes(overrides?.attributes)
  }

  return { ...defaultUserResource, ...overrides }
}

export { createUserResource }
