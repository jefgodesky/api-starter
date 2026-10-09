import jsonapi from 'ts-japi'
import { errorSerializer } from './serializers.ts'
import t from '../intl.ts'

const createError = (
  key: string
): jsonapi.ErrorDocument => {
  const msg = t(`errors.${key}`)
  return errorSerializer.serialize(new Error(msg))
}

export default createError
