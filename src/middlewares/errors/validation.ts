import { type Hook } from '@hono/zod-openapi'
import { type APIEnv } from '../../types.ts'
import createError from '../../utils/errors/create.ts'
import mapZodIssues from '../../utils/errors/validation/map.ts'

const defaultZodHook: Hook<unknown, APIEnv, string, undefined> = (result, context) => {
  if (result.success) return
  throw createError('validation', {
    context,
    issues: mapZodIssues(result.target, result.error)
  })
}

export default defaultZodHook
