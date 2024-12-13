import type Provider from './provider.ts'

export default interface TokenAccessAttributes {
  provider: Provider
  token: string
}
