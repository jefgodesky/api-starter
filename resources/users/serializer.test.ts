import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import { type User } from './db/types.ts'
import { usersType } from './schema.ts'
import getRoot from '../../utils/root.ts'
import { serializeUser, serializeUsers } from './serializer.ts'

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

describe('serializeUsers', () => {
  const page = { offset: 0, limit: 10, total: 100 }
  const params = new URLSearchParams()
  const users: User[] = [
    { id: crypto.randomUUID(), name: 'John Doe', username: 'john' },
    { id: crypto.randomUUID(), name: 'Jane Doe', username: null },
  ]

  it('serializes an array', async () => {
    const doc = await serializeUsers(users, page, params)
    expect(Array.isArray(doc.data)).toBe(true)
  })

  it('adds pagination and self links', async () => {
    const base = `${getRoot()}/${usersType}`
    const self = `page[offset]=${page.offset}&page[limit]=${page.limit}`
    const first = `page[offset]=0&page[limit]=${page.limit}`
    const next = `page[offset]=${page.limit}&page[limit]=${page.limit}`

    const doc = await serializeUsers(users, page, params)
    const links = doc.links as Record<
      string,
      { toString(): string } | undefined
    >
    expect(links.self?.toString()).toBe(`${base}?${self}`)
    expect(links.first?.toString()).toBe(`${base}?${first}`)
    expect(links.next?.toString()).toBe(`${base}?${next}`)
    expect(links.prev ?? null).toBeNull()
  })

  it('supports sparse fieldsets', async () => {
    const doc = await serializeUsers(users, page, params, ['name'])
    const data = doc.data as Array<{ attributes: Record<string, unknown> }>
    expect(data.every((r) => {
      const hasName = r.attributes.name !== undefined
      const hasNothingElse = Object.keys(r.attributes).length === 1
      return hasName && hasNothingElse
    })).toBe(true)
  })
})
