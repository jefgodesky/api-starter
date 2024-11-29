import { Links, PaginatedLinks } from '../jsonapi.d.ts'
import getPaginationQueries from './get-pagination-queries.ts'

import getEnvNumber from './get-env-number.ts'

const addPaginationLinks = (
  orig: Links,
  base: string,
  total: number,
  offset: number,
  limit: number = getEnvNumber('DEFAULT_PAGE_SIZE', 10)
): PaginatedLinks => {
  const queries = getPaginationQueries(total, offset, limit)
  return {
    ...orig,
    first: `${base}?${queries.first}`,
    prev: `${base}?${queries.prev}`,
    next: `${base}?${queries.next}`,
    last: `${base}?${queries.last}`
  }
}

export default addPaginationLinks
