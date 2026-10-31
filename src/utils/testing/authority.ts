import env from '../../env.js'

const getTestAuthority = (): string => {
  return `http://api:${env.PORT}`
}

export default getTestAuthority
