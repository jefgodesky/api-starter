import { type z } from '@hono/zod-openapi'
import jsonapi from 'ts-japi'
import { type Page } from '../../types/page.ts'
import { type User } from './db/types.ts'
import { UserDocument, UsersDocument, usersType } from './schema.ts'
import getUserLink from './link.ts'
import getPaginationLinks, { getURL } from '../../utils/paginate.ts'
import getRoot from '../../utils/root.ts'

const { Serializer, Linker, Paginator } = jsonapi

export const UserSerializer = new Serializer<User>(usersType, {
  version: '1.1',
  linkers: { resource: new Linker((u: User) => getUserLink(u)) },
})

const projectionFor = (fields?: string[]) =>
  fields === undefined ? null : Object.fromEntries(fields.map((f) => [f, 1]))

export const serializeUser = (
  user: User,
  fields?: string[],
): Promise<z.infer<typeof UserDocument>> =>
  UserSerializer.serialize(
    user,
    { projection: projectionFor(fields) },
  ) as Promise<z.infer<typeof UserDocument>>

export const serializeUsers = (
  users: User[],
  page: Page,
  params: URLSearchParams,
  fields?: string[],
): Promise<z.infer<typeof UsersDocument>> => {
  const base = `${getRoot()}/${usersType}`
  const links = getPaginationLinks(base, params, page)
  const self = getURL(base, params, page.offset, page.limit)

  return UserSerializer.serialize(users, {
    projection: projectionFor(fields),
    linkers: {
      paginator: new Paginator(() => links),
      document: new Linker(() => self),
    },
  }) as Promise<z.infer<typeof UsersDocument>>
}
