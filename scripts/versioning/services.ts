import { type VersionConfig } from './schema.ts'
import readYAML from '../read-yaml'

const buildServices = (versions: VersionConfig[]): Record<string, unknown> => {
  const tpl = readYAML('scripts/versioning/templates/compose.yaml')

  const services: Record<string, unknown> = {
    postgres: structuredClone(tpl.services.postgres),
    nginx: structuredClone(tpl.services.nginx)
  }

  services.nginx.depends_on = {}

  for (const { path, image } of versions) {
    const vtpl = structuredClone(tpl.services['api-v'])
    const name = `api-${path.substring(1)}`
    const check = `const res = await fetch('http://${name}:8000'); if (!res.ok) { process.exit(1) }`
    const custom = {
      container_name: name,
      healthcheck: Object.assign({}, vtpl.healthcheck, {
        test: ['CMD', 'node', '-e', check]
      })
    }

    if (image) {
      custom.image = image
    } else {
      custom.build = {
        context: '../..',
        dockerfile: 'Dockerfile',
        target: 'runtime'
      }
    }

    services[name] = Object.assign({}, vtpl, custom)
    services.nginx.depends_on[name] = { condition: 'service-healthy' }
  }

  return services
}

export default buildServices
