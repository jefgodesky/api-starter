import env from '../dist/env.js'
const res = await fetch(`http://localhost:${env.PORT}/`)
if (!res.ok) { process.exit(1) }
