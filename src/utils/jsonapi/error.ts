import type { ContentfulStatusCode } from '@hono/hono/utils/http-status'
import type { HTTPException } from '@hono/hono/http-exception'
import jsonapi from 'ts-japi'
import { getNestedValue, isString } from '@revolutionarygamesco/common'
import { errorSerializer } from './serializers.ts'
import getErrorCause from '../errors/cause.ts'
import t from '../intl.ts'

const createErrorResponse = (
  err: HTTPException
): { body: jsonapi.ErrorDocument; status: ContentfulStatusCode } => {
  const cause = getErrorCause(err)
  const pointer = getNestedValue(cause, 'context.req.path')
  const source = isString(pointer) ? { pointer } : undefined
  const japiError = new jsonapi.JapiError({
    status: err.status.toString(),
    code: err.message,
    title: t(`errors.${err.message}.title`, cause).trim(),
    detail: t(`errors.${err.message}.detail`, cause).trim(),
    source
  })

  const body = errorSerializer.serialize(japiError)
  return { body, status: err.status }
}

export default createErrorResponse
