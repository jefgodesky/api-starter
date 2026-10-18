import { Hono } from 'hono'
import { honoLogLayer, type HonoLogLayerVariables } from '@loglayer/hono'
import captureLogs, { type LogCapture } from './logs.ts'

export interface TestApp {
  app: Hono<{ Variables: HonoLogLayerVariables }>
  logs: LogCapture
}

const createTestApp = (): TestApp => {
  const logs = captureLogs()
  const app = new Hono<{ Variables: HonoLogLayerVariables }>()
  app.use(honoLogLayer({ instance: logs.logger, autoLogging: false }))
  return { app, logs }
}

export default createTestApp
