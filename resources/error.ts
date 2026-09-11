import { z } from '@hono/zod-openapi'

export const ErrorDocument = z.object({
  errors: z.array(z.object({
    status: z.string(),
    title: z.string(),
    detail: z.string().optional(),
    source: z.object({ pointer: z.string() }).partial().optional(),
  })),
}).openapi('ErrorDocument')
