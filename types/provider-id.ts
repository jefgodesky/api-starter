import type Provider from './provider.ts'

export default interface ProviderID {
  name: string
  provider: Provider
  pid: string
}
