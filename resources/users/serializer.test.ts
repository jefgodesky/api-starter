import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import { type User } from './db.ts'
import { usersType } from './schema.ts'
import { serializeUser } from './serializer.ts'

const id = crypto.randomUUID()
const name = 'John Doe'
const username = 'john'
const user: User = { id, name, username }

const getDoc = async (
  fields?: string[],
  // deno-lint-ignore no-explicit-any
): Promise<Record<string, any> | null> => {
  const doc = await serializeUser(user, fields)
  const resource = doc.data
  if (!resource) return null
  if (Array.isArray(resource)) return null
  if (!('attributes' in resource)) return null
  return { ...doc }
}

describe('serializeUser', () => {
  it('serializes attributes', async () => {
    const doc = await getDoc()
    expect(doc?.data?.attributes).toEqual({ name, username })
  })

  it('supports sparse fieldset', async () => {
    const doc = await getDoc(['name'])
    expect(doc?.data?.attributes).toEqual({ name })
  })

  it('can be narrowed down to no attributes', async () => {
    const doc = await getDoc([])
    expect(doc?.data?.attributes).toEqual({})
  })

  it('adds self link', async () => {
    const doc = await getDoc()
    const r = new RegExp(`/${usersType}/${username}$`)
    expect(doc?.data?.type).toBe(usersType)
    expect(doc?.data?.id).toBe(id)
    expect(doc?.data?.links?.self).toMatch(r)
  })

  it('sets JSON:API v1.1', async () => {
    const doc = await getDoc()
    expect(doc?.jsonapi?.version).toBe('1.1')
  })
})
