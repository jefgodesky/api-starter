import { z } from '@hono/zod-openapi'
import t from '../../../utils/strings/intl.ts'

const schema = z.record(
  z.string(),
  z.url().describe(t('docs.root.get.200.uri'))
).meta({
  propertyNames: {
    type: 'string',
    description: t('docs.root.get.200.key')
  }
})

export default schema
