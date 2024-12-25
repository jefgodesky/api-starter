import { Context, Status } from '@oak/oak'

const addErrorHeaders = (ctx: Context) => {
  switch (ctx.response.status) {
    case Status.Unauthorized:
      ctx.response.headers.set('WWW-Authenticate', 'Bearer')
      break
    default:
      break
  }
}

export default addErrorHeaders
