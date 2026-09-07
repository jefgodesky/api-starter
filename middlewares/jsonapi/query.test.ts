import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import createMiddlewareTest from '../../utils/testing/middleware.ts'
import parseJSONAPIQuery from './query.ts'

const tester = createMiddlewareTest(parseJSONAPIQuery)

describe('parseJSONAPIQuery', () => {
  it('parses JSON:API query parameters', async () => {
    const params = [
      'include=comments.author,ratings',
      'fields[articles]=title,body',
      'fields[people]=name',
      'sort=-created,title',
      'page[offset]=50',
      'page[limit]=25',
    ]

    const path = `/?${params.join('&')}`
    const { context } = await tester({ path })
    const { include, fields, sort, page } = context?.get('query') ?? {}

    expect(include).toEqual(['comments.author', 'ratings'])
    expect(fields).toEqual({ articles: ['title', 'body'], people: ['name'] })
    expect(sort).toEqual([
      { column: 'created', order: 'desc' },
      { column: 'title', order: 'asc' },
    ])
    expect(page.offset).toBe(50)
    expect(page.limit).toBe(25)
  })
})
