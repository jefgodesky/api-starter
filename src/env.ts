import { z, ZodError } from 'zod'
import tags from 'language-tags'
import { ALPHANUMERIC, selectRandomElement } from '@revolutionarygamesco/common'

const generateSecret = (): string => {
  let str = ''
  for (let i = 0; i < 32; i++) str += selectRandomElement(ALPHANUMERIC)
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
  RUN_INT_TESTS: z.stringbool().default(false),
  RETURN_STACK_TRACE: z.stringbool().default(false),
  PRETTY_LOGS: z.stringbool().default(false),
  MIN_LOG_LEVEL: z.literal(['trace', 'debug', 'info', 'warn', 'error', 'fatal'])
    .default('warn'),
  POSTGRES_USER: z.string().default('postgres'),
  POSTGRES_PASSWORD: z.string().default('password'),
  POSTGRES_DB: z.string().default('api'),
  POSTGRES_HOST: z.string().default('postgres'),
  POSTGRES_PORT: z.coerce.number().default(5432)
})

export type Environment = z.infer<typeof EnvSchema>
let env: Environment

try {
  env = EnvSchema.parse(process.env)
} catch (e) {
  console.error('❌ Invalid environment variables')
  console.error(z.prettifyError(e as ZodError))
  process.exit(1)
}

export default env
