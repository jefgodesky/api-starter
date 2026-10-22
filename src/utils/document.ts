import { type API } from './api.ts'
import pkg from '../../package.json' with { type: 'json' }

const document = (api: API): void => {
  api.doc('/docs', {
    openapi: '3.2.1',
    info: {
      version: pkg.version,
      title: 'API Starter'
    }
  })
}

export default document
