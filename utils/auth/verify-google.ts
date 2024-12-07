import { validateJWT } from '@cross/jwt'
import type { ProviderID } from '../../index.d.ts'
import { PROVIDERS } from '../../enums.ts'
import readableStreamToString from '../../utils/readable-stream-to-string.ts'

const fetchGoogleKeys = async (): Promise<Array<CryptoKey>> => {
  const res = await fetch('https://www.googleapis.com/oauth2/v3/certs')
  const text = res.body ? await readableStreamToString(res.body) : '{"keys":[]}'
  const { keys: jwks } = JSON.parse(text)

  const keys: CryptoKey[] = []
  for (const jwk of jwks) {
    const key = await crypto.subtle.importKey(
      'jwk',
      jwk,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      true,
      ['verify']
    )
    keys.push(key)
  }

  return keys
}

const verifyGoogleToken = async (token: string): Promise<ProviderID | false> => {
  const keys = await fetchGoogleKeys()
  for (const key of keys) {
    try {
      const data = await validateJWT(token, key)
      if (data) {
        return {
          provider: PROVIDERS.GOOGLE,
          name: data.name,
          pid: data.sub ?? ''
        }
      }
    // deno-lint-ignore no-empty
    } catch {}
  }

  return false
}

export default verifyGoogleToken
