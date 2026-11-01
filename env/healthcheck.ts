import env from '../dist/env.js'

const res = await fetch(env.BASE_URL)

if (!res.ok) process.exit(1)
