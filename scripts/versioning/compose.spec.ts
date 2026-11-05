import { describe, it, expect } from 'vitest'
import compose from './compose.ts'

describe('compose', () => {
  it('generates the compose file for an environment', () => {
    const actual = compose('test', [
      { path: '/v1', status: 'predecessor-version', image: 'ghcr.io/tester/test-api:v1' },
      { path: '/v2', status: 'latest-version', image: 'ghcr.io/tester/test-api:v2' },
      { path: '/v3', status: 'successor-version' }
    ])

    expect((actual.name as string).endsWith('test')).toBe(true)
    expect(actual).toMatchObject({
      services: {
        postgres: expect.anything(),
        nginx: {
          depends_on: {
            'api-v1': { condition: 'service_healthy' },
            'api-v2': { condition: 'service_healthy' },
            'api-v3': { condition: 'service_healthy' }
          }
        },
        'api-v1': {
          container_name: 'api-v1',
          image: 'ghcr.io/tester/test-api:v1'
        },
        'api-v2': {
          container_name: 'api-v2',
          image: 'ghcr.io/tester/test-api:v2'
        },
        'api-v3': {
          container_name: 'api-v3',
          build: {
            context: '../..',
            dockerfile: 'Dockerfile',
            target: 'runtime'
          }
        }
      }
    })
  })
})
