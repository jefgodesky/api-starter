import { type Context } from 'hono'
import { type ContentfulStatusCode } from 'hono/utils/http-status'
import localize from './localize.ts'

export const getError = (
  status: ContentfulStatusCode,
  key: string,
): { status: string; title: string } => {
  return {
    status: status.toString(),
    title: localize(`errors.${key}`),
  }
}

const sendError = <S extends ContentfulStatusCode>(
  c: Context,
  status: S,
  key: string,
) => {
  const err = getError(status, key)
  return c.json({ errors: [err] }, status)
}

export default sendError
