import env from '../src/env.ts'

const res = await fetch(`http://localhost:${env.PORT}/`)

if (!res.ok) Deno.exit(1)
