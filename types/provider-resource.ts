import type BaseResource from './base-resource.ts'

export default interface ProviderResource extends BaseResource {
  type: 'provider'
}
