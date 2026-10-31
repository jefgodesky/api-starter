import { describe, beforeEach, it, expect } from 'vitest'
import { HTTP_OK } from '@revolutionarygamesco/common'
import { type VersionResponses } from './schemas.ts'
import getTestAuthority from '../../utils/testing/authority.ts'
import env from '../../env.ts'

describe.runIf(env.RUN_INT_TESTS)('/', () => {
  let res: Response

  beforeEach(async () => {
    res = await fetch(getTestAuthority())
  })

  describe('GET /', () => {
    it('returns OK', async () => {
      expect(res.status).toBe(HTTP_OK)
    })

    it('returns a list of versions', async () => {
      const body = await res.json() as VersionResponses
      const live = body.filter(v => v.status === 'live')
      expect(body.length).toBeGreaterThan(0)
      expect(live.length).toBe(1)
      expect(live[0].uri).toBeDefined()
    })
  })
})
