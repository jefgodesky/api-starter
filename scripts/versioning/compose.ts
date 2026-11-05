import { ComposeTemplateSchema, type Compose, type Service, type VersionConfig } from './schema.ts'
import { kebabize, splitKebab, snakify } from '@revolutionarygamesco/common'
import readYAML from '../read-yaml.ts'
import pkg from '../../package.json' with { type: 'json' }

const compose = (
  env: string,
  versions: VersionConfig[]
): Compose => {
  const { services, ...other } = ComposeTemplateSchema.parse(readYAML('scripts/versioning/templates/compose.yaml'))
  const { 'api-v': vtpl, nginx, ...otherServices } = services
  const versionContainers: Record<string, Service> = {}
  const dependsOn: Record<string, { condition: string }> = {}
  const build = {
    context: '../..',
    dockerfile: 'Dockerfile',
    target: 'runtime'
  }

  for (const { path, image } of versions) {
    const name = kebabize(['api', path.substring(1)])
    const check = `const res = await fetch('http://${name}:8000'); if (!res.ok) { process.exit(1) }`
    versionContainers[name] = {
      ...vtpl,
      container_name: name,
      healthcheck: {
        ...vtpl.healthcheck,
        test: ['CMD', 'node', '-e', check]
      },
      ...(image ? { image } : { build })
    }

    dependsOn[name] = { condition: 'service_healthy' }
  }

  return {
    ...other,
    name: snakify([...splitKebab(pkg.name), env]),
    services: {
      ...otherServices,
      nginx: { ...nginx, depends_on: { ...nginx.depends_on, ...dependsOn } },
      ...versionContainers
    }
  }
}

export default compose
