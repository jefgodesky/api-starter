import parseVersion from '../dist/utils/version/parse.js'

const { path } = parseVersion()
const res = await fetch(`http://127.0.0.1:8000/${path}`)

if (!res.ok) process.exit(1)
