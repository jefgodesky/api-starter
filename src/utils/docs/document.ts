import { Scalar } from '@scalar/hono-api-reference'
import { type API } from '../routers/api.ts'
import versionPath from '../strings/path.ts'
import pkg from '../../../package.json' with { type: 'json' }

type Bindings = {
  ENVIRONMENT: string
}

const document = (api: API): void => {
  api.doc('/spec', {
    openapi: '3.2.1',
    info: {
      version: pkg.version,
      title: 'API Starter'
    }
  })

  api.get('/docs', Scalar<{ Bindings: Bindings }>(c => ({
    url: versionPath('/spec'),
    theme: 'bluePlanet',
    layout: 'modern',
    agent: { disabled: true }
  })))
}

export default document
