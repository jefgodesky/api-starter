import { type Hook } from '@hono/zod-openapi'
import { type Env } from '../../types/jsonapi-query.ts'
import localize from '../../utils/localize.ts'

const defaultHook: Hook<unknown, Env, string, unknown> = (result, c) => {
  if (result.success) return
  const status = result.target === 'json' ? 422 : 400
  return c.json({
    errors: result.error.issues.map((issue) => ({
      status: status.toString(),
      title: localize('validation_error'),
      detail: issue.message,
      source: { pointer: '/' + issue.path.join('/') },
    })),
  }, status)
}

export default defaultHook
