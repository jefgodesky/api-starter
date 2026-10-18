import { afterEach, beforeEach } from 'vitest'
import {
  BlankTransport,
  type LogLayerTransportParams,
  type LogLevelType
} from 'loglayer'
import log, { transport } from '../../log.ts'

export interface LogCapture {
  readonly records: LogLayerTransportParams[]
  at: (level: LogLevelType) => LogLayerTransportParams[]
}

const captureLogs = (): LogCapture => {
  const records: LogLayerTransportParams[] = []

  beforeEach(() => {
    records.length = 0
    log.withFreshTransports(new BlankTransport({
      shipToLogger: (params) => {
        records.push(params)
        return params.messages
      }
    }))
  })

  afterEach(() => {
    log.withFreshTransports(transport)
  })

  return {
    records,
    at: (level) => records.filter((r) => r.logLevel === level)
  }
}

export default captureLogs
