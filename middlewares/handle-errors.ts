import { Middleware, Context, Next, Status, isHttpError } from '@oak/oak'
import getJSONAPI from '../utils/get-jsonapi.ts'
import getRoot from '../utils/get-root.ts'

const handleErrors: Middleware = async (ctx: Context, next: Next) => {
  try {
    await next()
  } catch (err) {
    if (isHttpError(err)) {
      ctx.response.status = err.status ?? Status.InternalServerError
      ctx.response.type = 'application/vnd.api+json'
      ctx.response.body = {
        jsonapi: getJSONAPI(),
        links: {
          self: ctx.request.url,
          describedBy: getRoot() + '/docs'
        },
        errors: [
          {
            status: err.status.toString(),
            detail: err.message
          }
        ]
      }
    } else {
      console.error(err)
    }
  }
}

export default handleErrors
