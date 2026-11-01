import getRoot from '../dist/utils/strings/root.js'

const res = await fetch(getRoot())

if (!res.ok) process.exit(1)
