export const PROVIDERS = {
  GOOGLE: 'google',
  DISCORD: 'discord',
  GITHUB: 'github'
} as const

type Provider = typeof PROVIDERS[keyof typeof PROVIDERS]

export default Provider
