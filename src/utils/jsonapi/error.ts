import type { ContentfulStatusCode } from '@hono/hono/utils/http-status'
import jsonapi from 'ts-japi'
import { isString } from '@revolutionarygamesco/common'
import { errorSerializer } from './serializers.ts'
import t from '../intl.ts'
import {
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_NOT_FOUND
} from '../../constants/http-status.ts'

const statusCodes: Record<string, ContentfulStatusCode> = {
  notFound: HTTP_NOT_FOUND,
  other: HTTP_INTERNAL_SERVER_ERROR
}

const createError = (
  key: string,
  data: Record<string, unknown> = {}
): { body: jsonapi.ErrorDocument; status: ContentfulStatusCode } => {
  const status = statusCodes[key] ?? statusCodes.other
  const pointer = isString(data?.path) ? data?.path : null
  const source = pointer ? { pointer } : undefined
  const err = new jsonapi.JapiError({
    status: status.toString(),
    code: key,
    title: t(`errors.${key}.title`, data).trim(),
    detail: t(`errors.${key}.detail`, data).trim(),
    source
  })

  const body = errorSerializer.serialize(err)
  return { body, status }
}

export default createError
