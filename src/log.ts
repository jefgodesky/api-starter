import { pino } from 'pino'
import { PinoTransport } from '@loglayer/transport-pino'
import createLogger from './utils/logger/create.ts'
import env from './env.ts'

const logger = createLogger(new PinoTransport({
  logger: pino(env.PRETTY_LOGS
    ? { transport: { target: 'pino-pretty' } }
    : {}
  )
}))

logger.setLevel(env.MIN_LOG_LEVEL)

export default logger
