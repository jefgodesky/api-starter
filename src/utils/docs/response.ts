import { z } from '@hono/zod-openapi'

export type ResponseDocumentation<
  S extends z.ZodType,
  H extends z.ZodType | undefined = undefined
> = {
  description: string
  content: {
    [mime: string]: { schema: S }
  }
} & (H extends z.ZodType ? { headers: H } : {})

const documentResponse = <
  S extends z.ZodType,
  H extends z.ZodType | undefined = undefined
>(
  description: string,
  schema: S,
  headers?: H,
  mimeType: string = 'application/json'
): ResponseDocumentation<S, H> => ({
  description,
  content: {
    [mimeType]: { schema }
  },
  ...(headers === undefined ? {} : { headers })
}) as ResponseDocumentation<S, H>

export default documentResponse
