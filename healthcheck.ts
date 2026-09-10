import getRoot from './utils/root.ts'

const response = await fetch(getRoot()).catch(() => null)

Deno.exit(response && response.ok ? 0 : 1)
