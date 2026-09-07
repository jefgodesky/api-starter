import parseNumber from './num.ts'
import getEnvNum from '../get-env-num.ts'

export const DEFAULT_PAGE_SIZE = getEnvNum('DEFAULT_PAGE_SIZE', 10)
export const MAX_PAGE_SIZE = getEnvNum('MAX_PAGE_SIZE', 100)

const parsePagination = (
  url: URL,
): { offset: number; limit: number } => {
  const offset = parseNumber(url, 'page[offset]', 0)
  const limit = Math.min(
    parseNumber(url, 'page[limit]', DEFAULT_PAGE_SIZE),
    MAX_PAGE_SIZE,
  )
  return { offset, limit }
}

export default parsePagination
