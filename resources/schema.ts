import { z } from '@hono/zod-openapi'

export const jsonapi = z.object({
  version: z.string().openapi({ example: '1.1' }),
})
