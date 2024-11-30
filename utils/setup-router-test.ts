import getEnvNumber from './get-env-number.ts'
import api from '../api.ts'

interface RouterTest {
  controller: AbortController
  listenPromise: Promise<void>
}

const setupRouterTest = async (): Promise<RouterTest> => {
  const port = getEnvNumber('PORT', 8001)
  const controller = new AbortController()
  const ready = new Promise(resolve => {
    api.addEventListener('listen', () => { resolve(true) })
  })

  const listenPromise = api.listen({ port, signal: controller.signal })
  await ready
  return { controller, listenPromise }
}

const closeRouterTest = ({ controller, listenPromise }: RouterTest): void => {
  controller.abort()
  setTimeout(() => {
    listenPromise.catch(() => {})
  }, 0)
}

export {
  type RouterTest,
  setupRouterTest,
  closeRouterTest
}
