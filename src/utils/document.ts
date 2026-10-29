import { type API } from './routers/api.ts'
import pkg from '../../package.json' with { type: 'json' }

const document = (api: API): void => {
  api.doc('/spec', {
    openapi: '3.2.1',
    info: {
      version: pkg.version,
      title: 'API Starter'
    }
  })
}

export default document
