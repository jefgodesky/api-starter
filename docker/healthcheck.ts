import getEnvNum from '../src/utils/env/num.ts'

const port = getEnvNum('PORT', 8001)
const res = await fetch(`http://localhost:${port}/`)

if (!res.ok) Deno.exit(1)
