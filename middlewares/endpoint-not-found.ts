import { Middleware, Status } from '@oak/oak'
import { createHttpError } from 'jsr:@oak/commons@1/http_errors'
import getMessage from '../utils/get-message.ts'

const endpointNotFound: Middleware = () => {
  throw createHttpError(Status.NotFound, getMessage('endpoint_not_found'))
}

export default endpointNotFound
