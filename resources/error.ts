import { z } from '@hono/zod-openapi'

export const ErrorDocument = z.object({
  errors: z.array(z.object({
    status: z.string().openapi({ example: '422' }),
    title: z.string().openapi({ example: 'Validation error.' }),
    detail: z.string().optional().openapi({
      example: 'Invalid input: expected "users"',
    }),
    source: z.object({ pointer: z.string().openapi({ example: '/data/type' }) })
      .partial().optional(),
  })),
}).openapi('ErrorDocument')
