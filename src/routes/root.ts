import { z, createRoute } from '@hono/zod-openapi'
import { HTTP_OK } from '@revolutionarygamesco/common'
import { type RouterMeta } from '../types.ts'
import createRouter from '../utils/routers/router.js'
import t from '../utils/strings/intl.ts'
import versionPath from '../utils/strings/path.ts'

const createRootRouter = (routers: RouterMeta[]) => {
  const { router } = createRouter()
  return router.openapi(
    createRoute({
      method: 'get',
      path: '/',
      responses: {
        [HTTP_OK]: {
          description: t('docs.root.get.200.main'),
          headers: z.looseObject({
            Link: z.string().describe(t('docs.root.get.200.link'))
          }),
          content: {
            'application/json': {
              schema: z.record(
                z.string(),
                z.url().describe(t('docs.root.get.200.uri'))
              ).meta({
                propertyNames: {
                  type: 'string',
                  description: t('docs.root.get.200.key')
                }
              })
            }
          }
        }
      }
    }),
    c => {
      const directory: Record<string, string> = {}
      const links: string[] = []

      for (const { path, resource } of routers) {
        const abs = versionPath(path)
        links.push(`<${abs}>`)
        directory[resource] = abs
      }

      c.header('Link', links.join(', '))
      return c.json(directory)
    }
  )
}

export default createRootRouter
