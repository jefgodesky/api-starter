export default interface UserAttributes {
  name?: string
  username?: string
}

const allUserAttributes = ['name', 'username'] as const
const publicUserAttributes = ['name', 'username'] as const
type UserAttributesKeys = (typeof allUserAttributes)[number]

export {
  allUserAttributes,
  publicUserAttributes,
  type UserAttributesKeys
}
