import { z } from '@hono/zod-openapi'

export const UserAttributes = z.object({
  name: z.string().openapi({ example: 'John Doe' }),
  username: z.string().nullable().openapi({ example: 'john' }),
}).openapi('UserAttributes')

export const UserResource = z.object({
  type: z.literal('users'),
  id: z.uuidv4(),
  attributes: UserAttributes,
}).openapi('UserResource')

export const UserPatchBody = z.object({
  data: z.object({
    type: z.literal('users'),
    id: z.uuidv4(),
    attributes: UserAttributes.partial(),
  }),
}).openapi('UserPatchBody')

export type UserAttributes = z.infer<typeof UserAttributes>
