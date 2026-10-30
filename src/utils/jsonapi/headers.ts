import { JSONAPI_MEDIA } from './constants.js'

const makeHeaders = (
  links: string[] = []
): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': JSONAPI_MEDIA
  }

  if (links.length > 0) {
    headers['Links'] = links.join(', ')
  }

  return headers
}

export default makeHeaders
