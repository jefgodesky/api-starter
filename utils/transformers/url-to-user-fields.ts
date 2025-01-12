import { Context } from '@oak/oak'
import { intersect } from '@std/collections'
import { type UserAttributesKeys, publicUserAttributes, allUserAttributes } from '../../types/user-attributes.ts'

const urlToUserFields = (input: Context | URL): readonly UserAttributesKeys[] | undefined => {
  const url = (input as Context)?.request?.url ?? input
  const fields = url.searchParams.get('fields[users]')

  if (fields !== null) {
    const requested = fields.split(',')
    return intersect(requested, allUserAttributes) as readonly UserAttributesKeys[]
  }

  return publicUserAttributes
}

export default urlToUserFields
