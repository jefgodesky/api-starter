import type User from '../../collections/users/model.ts'
import { type ProviderID } from '../../index.d.ts'
import type Account from '../../collections/auth/accounts/model.ts'

const userProviderIdToAccount = (user: User, pid: ProviderID): Account => {
  return {
    uid: user.id ?? '',
    provider: pid.provider,
    pid: pid.pid
  }
}

export default userProviderIdToAccount
