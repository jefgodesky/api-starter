import { z } from '@hono/zod-openapi'

export const usersType = 'users'

export const UserAttributes = z.object({
  name: z.string().openapi({ example: 'John Doe' }),
  username: z.string().nullable().openapi({ example: 'john' }),
}).openapi('UserAttributes')

export const UserResource = z.object({
  type: z.literal(usersType),
  id: z.uuidv4(),
  attributes: UserAttributes,
}).openapi('UserResource')

export const UserPatchBody = z.object({
  data: z.object({
    type: z.literal(usersType),
    id: z.uuidv4(),
    attributes: UserAttributes.partial(),
  }),
}).openapi('UserPatchBody')

export type UserAttributes = z.infer<typeof UserAttributes>

export const UserParams = z.object({
  id: z.string().openapi({ param: { name: 'id', in: 'path' } }),
}).openapi('UserParams')

export const UserDocument = z.object({
  jsonapi: z.object({ version: z.string() }),
  data: UserResource,
  links: z.object({ self: z.string() }).partial().optional(),
}).openapi('UserDocument')

export const UsersDocument = z.object({
  jsonapi: z.object({ version: z.string() }),
  data: z.array(UserResource),
  links: z.object({
    self: z.string(),
    first: z.string(),
    last: z.string(),
    prev: z.string().nullable(),
    next: z.string().nullable(),
  }).partial().optional(),
}).openapi('UsersDocument')
