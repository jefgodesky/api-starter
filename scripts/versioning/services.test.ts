import { describe, it, expect } from 'vitest'
import buildServices from './services.ts'

describe('buildServices', () => {
  it('builds services', () => {
    const actual = buildServices([
      { path: '/v1', status: 'predecessor-version', image: 'ghcr.io/tester/test-api:v1' },
      { path: '/v2', status: 'latest-version', image: 'ghcr.io/tester/test-api:v2' },
      { path: '/v3', status: 'successor-version' }
    ])

    expect(actual.postgres).toBeDefined()
    expect(actual.nginx).toBeDefined()
    expect(actual['api-v1']).toBeDefined()
    expect(actual['api-v2']).toBeDefined()
    expect(actual['api-v3']).toBeDefined()

    expect(actual['api-v1'].image).toBe('ghcr.io/tester/test-api:v1')
    expect(actual['api-v1'].container_name).toBe('api-v1')
    expect(actual.nginx.depends_on['api-v1'].condition).toBe('service-healthy')

    expect(actual['api-v2'].image).toBe('ghcr.io/tester/test-api:v2')
    expect(actual['api-v2'].container_name).toBe('api-v2')
    expect(actual.nginx.depends_on['api-v2'].condition).toBe('service-healthy')

    expect(actual['api-v3'].build.context).toBe('../..')
    expect(actual['api-v3'].build.dockerfile).toBe('Dockerfile')
    expect(actual['api-v3'].build.target).toBe('runtime')
    expect(actual['api-v3'].container_name).toBe('api-v3')
    expect(actual.nginx.depends_on['api-v3'].condition).toBe('service-healthy')
  })
})
