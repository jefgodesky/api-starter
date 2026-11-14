import { type APIRouteHandler, type RouterMeta } from '../../../types.ts'
import route from './route.ts'
import versionPath from '../../../utils/strings/path.ts'

const createRootListHandler = (routers: RouterMeta[]): APIRouteHandler<typeof route> => {
  return c => {
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
}

export default createRootListHandler
