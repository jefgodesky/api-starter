import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import t from '../intl.ts'
import createError from './error.ts'

describe('createError', () => {
  it('creates a JSON:API error object', () => {
    const err = createError('notFound')
    expect(err.errors).toHaveLength(1)
    expect(err.errors[0].detail).toBe(t('errors.notFound'))
  })
})
