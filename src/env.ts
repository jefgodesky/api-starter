import { z } from 'zod'
import tags from 'language-tags'
import { selectRandomElement } from '@revolutionarygamesco/common'
import * as process from 'node:process'

const generateSecret = (): string => {
  const lower = 'abcdefghijklmnopqrstuvwxyz'
  const upper = lower.toUpperCase()
  const num = '0123456789'
  const alpha = (lower + upper + num).split('')

  let str = ''
  for (let i = 0; i < 32; i++) str += selectRandomElement(alpha)
  return str
}

const EnvSchema = z.object({
  API_VERSION: z.string().default('1'),
  API_DOMAIN: z.string().default('localhost'),
  API_PROTOCOL: z.literal(['http', 'https']).default('https'),
  PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string().default(generateSecret),
  MAX_PAGE_SIZE: z.coerce.number().default(100),
  DEFAULT_PAGE_SIZE: z.coerce.number().default(10),
  LANG: z.string()
    .default('en-US')
    .superRefine((value, ctx) => {
      const tag = tags(value)
      if (tag.valid()) return
      for (const err of tag.errors()) {
        ctx.addIssue({ code: 'custom', message: err.message })
      }
    })
    .transform(v => tags(v).format()),
  RUN_INT_TESTS: z.stringbool(),
  RETURN_STACK_TRACE: z.stringbool(),
  LOG_DEBUG: z.stringbool(),
  POSTGRES_USER: z.string().default('postgres'),
  POSTGRES_PASSWORD: z.string().default('password'),
  POSTGRES_DB: z.string().default('api'),
  POSTGRES_HOST: z.string().default('postgres'),
  POSTGRES_PORT: z.coerce.number().default(5432)
})

const env = EnvSchema.parse(process.env)
export default env
