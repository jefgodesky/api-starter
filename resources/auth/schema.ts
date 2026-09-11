import { z } from '@hono/zod-openapi'

export const PROVIDERS = ['google', 'discord', 'github'] as const

export const Provider = z.enum(PROVIDERS).openapi('Provider', {
  example: 'google',
})

export type Provider = z.infer<typeof Provider>
