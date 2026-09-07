import jsonapi from 'ts-japi'
import { type User } from './db.ts'
import getUserLink from './link.ts'

const { Serializer, Linker } = jsonapi

export const UserSerializer = new Serializer<User>('users', {
  version: '1.1',
  linkers: { resource: new Linker((u: User) => getUserLink(u)) },
})

const projectionFor = (fields?: string[]) =>
  fields === undefined ? null : Object.fromEntries(fields.map((f) => [f, 1]))

export const serializeUser = (user: User, fields?: string[]) =>
  UserSerializer.serialize(user, { projection: projectionFor(fields) })
