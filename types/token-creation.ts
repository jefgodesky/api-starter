import { PROVIDERS } from './provider.ts'
import type TokenAccessAttributes from './token-access-attributes.ts'
import type TokenRefreshAttributes from './token-refresh-attributes.ts'

export default interface TokenCreation {
  data: {
    type: 'tokens'
    attributes: TokenAccessAttributes | TokenRefreshAttributes
  }
}

// deno-lint-ignore no-explicit-any
const isTokenCreation = (candidate: any): candidate is TokenCreation => {
  if (!candidate?.data) return false

  const { data } = candidate
  if (Object.keys(data).join(',') !== 'type,attributes') return false

  const { type, attributes } = data
  if (type !== 'tokens') return false

  const { token, provider } = attributes
  if (provider !== undefined && !Object.values(PROVIDERS).includes(provider)) return false
  return typeof token === 'string'
}

export { isTokenCreation }
