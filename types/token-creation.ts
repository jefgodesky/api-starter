export default interface TokenCreation {
  data: {
    type: 'tokens'
    attributes: {
      token: string
    }
  }
}

// deno-lint-ignore no-explicit-any
const isTokenCreation = (candidate: any): candidate is TokenCreation => {
  if (!candidate?.data) return false

  const { data } = candidate
  if (Object.keys(data).join(',') !== 'type,attributes') return false

  const { type, attributes } = data
  if (type !== 'tokens') return false

  const { token } = attributes
  return typeof token === 'string'

}

export { isTokenCreation }
