import { type JSONAPISort } from '../../types/jsonapi-query.ts'
import parseCommaSeparated from '../comma-sep.ts'

const parseSort = (
  url: URL,
): JSONAPISort[] => {
  if (!url.searchParams.has('sort')) return []
  const columns = parseCommaSeparated(url.searchParams.get('sort') ?? '')
  return columns.map((col) => {
    const order = col.startsWith('-') ? 'desc' : 'asc'
    const column = order === 'desc' ? col.substring(1) : col
    return { column, order }
  })
}

export default parseSort
