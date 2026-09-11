import { z } from '@hono/zod-openapi'
import { jsonapi } from '../schema.ts'

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
  jsonapi,
  data: UserResource,
  links: z.object({
    self: z.string().openapi({
      format: 'uri',
      example: 'https://api.example.com/v1/users/john',
    }),
  }).partial().optional(),
}).openapi('UserDocument')

export const UsersDocument = z.object({
  jsonapi,
  data: z.array(UserResource),
  links: z.object({
    self: z.string().openapi({
      format: 'uri',
      example:
        'https://api.example.com/v1/users?page[offset]=20&page[limit]=10',
    }),
    first: z.string().openapi({
      format: 'uri',
      example: 'https://api.example.com/v1/users?page[offset]=0&page[limit]=10',
    }),
    last: z.string().openapi({
      format: 'uri',
      example:
        'https://api.example.com/v1/users?page[offset]=90&page[limit]=10',
    }),
    prev: z.string().nullable().openapi({
      format: 'uri',
      example:
        'https://api.example.com/v1/users?page[offset]=10&page[limit]=10',
    }),
    next: z.string().nullable().openapi({
      format: 'uri',
      example:
        'https://api.example.com/v1/users?page[offset]=30&page[limit]=10',
    }),
  }).partial().optional(),
}).openapi('UsersDocument')
