import type { JSONAPI } from '../jsonapi.d.ts'

const getJSONAPI = (): JSONAPI => {
  return { version: '1.1' }
}

export default getJSONAPI
