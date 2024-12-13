import type Provider from './provider.ts'

export interface ProviderID {
  name: string
  provider: Provider
  pid: string
}
