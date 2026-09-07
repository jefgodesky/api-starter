import { createMiddleware } from 'hono/factory'
import parseFields from '../../utils/query/fields.ts'
import parseInclude from '../../utils/query/include.ts'
import parseSort from '../../utils/query/sort.ts'
import parsePagination from '../../utils/query/pagination.ts'

const parseJSONAPIQuery = createMiddleware(async (c, next) => {
  const url = new URL(c.req.url)
  c.set('query', {
    include: parseInclude(url),
    fields: parseFields(url),
    sort: parseSort(url),
    page: parsePagination(url),
  })

  await next()
})

export default parseJSONAPIQuery
