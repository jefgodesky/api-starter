import { type Context } from 'hono'
import { type ContentfulStatusCode } from 'hono/utils/http-status'
import localize from './localize.ts'

export const getError = (
  status: number,
  key: string,
): { status: string; title: string } => {
  return {
    status: status.toString(),
    title: localize(key),
  }
}

const sendError = (
  c: Context,
  status: ContentfulStatusCode,
  key: string,
) => {
  const err = getError(status, key)
  return c.json({ errors: [err] }, status)
}

export default sendError
