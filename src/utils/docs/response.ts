import { z } from '@hono/zod-openapi'
import { type ContentfulStatusCode } from 'hono/utils/http-status'

export type ResponseDocumentation<
  S extends z.ZodType,
  H extends z.ZodType | undefined = undefined
> = Record<ContentfulStatusCode, {
  description: string
  content: {
    [mime: string]: { schema: S }
  }
} & (H extends z.ZodType ? { headers: H } : {})>

const documentResponse = <
  S extends z.ZodType,
  H extends z.ZodType | undefined = undefined
>(
  status: number,
  description: string,
  schema: S,
  headers?: H,
  mimeType: string = 'application/json'
): ResponseDocumentation<S, H> => ({
  [status as ContentfulStatusCode]: {
    description,
    content: {
      [mimeType]: { schema }
    },
    ...(headers === undefined ? {} : { headers })
  }
}) as ResponseDocumentation<S, H>

export default documentResponse
