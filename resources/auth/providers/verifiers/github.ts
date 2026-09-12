import { type ProviderID } from '../types.ts'
import getUserAgent from '../../../../utils/user-agent.ts'

interface GitHubUser {
  id?: number | string
  name?: string | null
  login?: string
}

export const GITHUB_URL = 'https://api.github.com/user'

const verifyGitHub = async (token: string): Promise<ProviderID | null> => {
  const res = await fetch(GITHUB_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': getUserAgent(),
    },
  })

  if (!res.ok) {
    await res.body?.cancel()
    return null
  }

  const data = await res.json() as GitHubUser
  if (data.id === undefined || data.id === null) return null

  return {
    name: data.name ?? data.login ?? 'GitHub User',
    pid: data.id.toString(),
  }
}

export default verifyGitHub
