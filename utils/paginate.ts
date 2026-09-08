import { type Page } from '../types/page.ts'
import getQueryString from './query-string.ts'

export interface PaginationLinks {
  first: string
  last: string
  prev: string | null
  next: string | null
}

export const getURL = (
  base: string,
  params: URLSearchParams,
  offset: number,
  limit: number,
): string => {
  const p = new URLSearchParams(params)
  p.set('page[offset]', offset.toString())
  p.set('page[limit]', limit.toString())
  const query = getQueryString(p)
  return `${base}?${query}`
}

const getPaginationLinks = (
  base: string,
  params: URLSearchParams,
  page: Page,
): PaginationLinks => {
  const { offset, limit, total } = page
  const lastOffset = total > 0 ? Math.floor((total - 1) / limit) * limit : 0
  return {
    first: getURL(base, params, 0, limit),
    last: getURL(base, params, lastOffset, limit),
    prev: offset > 0
      ? getURL(base, params, Math.max(0, offset - limit), limit)
      : null,
    next: offset + limit < total
      ? getURL(base, params, offset + limit, limit)
      : null,
  }
}

export default getPaginationLinks
