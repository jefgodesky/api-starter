import { z } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'
import { getNestedValue, isString } from '@revolutionarygamesco/common'
import getErrorCause from './cause.ts'
import t from '../strings/intl.ts'

export const ErrorSchema = z.object({
  title: z.string(),
  status: z.number().int()
    .min(100, t('errors.http.status.min'))
    .max(599, t('errors.http.status.max')),
  detail: z.string(),
  instance: z.string().optional()
})

export type ErrorResponse = z.infer<typeof ErrorSchema>

const createErrorResponse = (
  err: HTTPException
): ErrorResponse => {
  const prefix = `errors.http.${err.message}`
  const cause = getErrorCause(err)
  const title = t(`${prefix}.title`, cause)
  const detail = t(`${prefix}.detail`, cause)

  const path = getNestedValue(cause, 'context.req.path')
  const instance = isString(path) ? path : null

  const base = { title, detail, status: err.status }
  return instance
    ? { ...base, instance }
    : base
}

export default createErrorResponse
