import type { HTTPException } from '@hono/hono/http-exception'
import { getObjectRecord } from '@revolutionarygamesco/common'

const getErrorCause = (
  err: HTTPException
): Record<string, unknown> => {
  const cause = getObjectRecord(err.cause)
  return cause ? cause : {}
}

export default getErrorCause
