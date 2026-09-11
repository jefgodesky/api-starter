import { z } from '@hono/zod-openapi'
import { MEDIA_TYPE } from '../utils/media-type.ts'
import localizeDocs from '../utils/localize-docs.ts'

const docCommon = localizeDocs('common')

export const jsonapi = z.object({
  version: z.string().openapi({ example: '1.1' }),
})

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

export const errorResponse = (
  route: string,
  status: number,
  doc: (route: string, status: number) => string = docCommon,
) => ({
  description: doc(route, status),
  content: { [MEDIA_TYPE]: { schema: ErrorDocument } },
})

export const standardErrors = {
  400: errorResponse('*', 400),
  406: errorResponse('*', 406),
  415: errorResponse('*', 415),
}
