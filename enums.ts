export const PROVIDERS = {
  GOOGLE: 'google',
  DISCORD: 'discord',
  GITHUB: 'github',
  APPLE: 'apple'
} as const

export type Provider = typeof PROVIDERS[keyof typeof PROVIDERS]
