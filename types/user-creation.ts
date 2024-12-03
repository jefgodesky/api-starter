export default interface UserCreation {
  data: {
    type: 'users'
    attributes: {
      name: string
      username?: string
    }
  }
}

// deno-lint-ignore no-explicit-any
const isUserCreation = (candidate: any): candidate is UserCreation => {
  if (!candidate?.data) return false

  const { data } = candidate
  if (Object.keys(data).join(',') !== 'type,attributes') return false

  const { type, attributes } = data
  if (type !== 'users') return false

  const { name, username } = attributes
  if (typeof name !== 'string') return false
  if (username && typeof username !== 'string') return false

  const possible = ['name', 'username']
  const notPossible = Object.keys(attributes).filter(key => !possible.includes(key))
  return notPossible.length === 0
}

export { isUserCreation }
