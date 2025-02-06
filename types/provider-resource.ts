import type BaseResource from './base-resource.ts'
import { isLinks } from './links.ts'
import Provider, { isProvider } from './provider.ts'
import isObject from '../utils/guards/object.ts'

export default interface ProviderResource extends BaseResource {
  type: 'provider'
  id: Provider
}

const isProviderResource = (candidate: unknown): candidate is ProviderResource => {
  if (!isObject(candidate)) return false
  const obj = candidate as Record<string, unknown>
  if (obj.type !== 'provider') return false
  if (!isProvider(obj.id)) return false
  if (obj.links !== undefined && !isLinks(obj.links)) return false

  const permitted = ['type', 'id', 'links']
  return Object.keys(obj).every(key => permitted.includes(key))
}

export { isProviderResource }
