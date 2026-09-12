import { type ProviderID } from '../types.ts'
import getUserAgent from '../../../../utils/user-agent.ts'

interface DiscordUser {
  id?: number | string
  name?: string | null
  login?: string
}

export const DISCORD_URL = 'https://discord.com/api/v10/users/@me'

const verifyDiscord = async (token: string): Promise<ProviderID | null> => {
  const res = await fetch(DISCORD_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': getUserAgent(),
    },
  })

  if (!res.ok) {
    await res.body?.cancel()
    return null
  }

  const data = await res.json() as DiscordUser
  if (data.id === undefined || data.id === null) return null

  return {
    name: data.name ?? data.login ?? 'Discord User',
    pid: data.id.toString(),
  }
}

export default verifyDiscord
