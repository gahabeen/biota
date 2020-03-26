// types
import { FaunaRoleOptions, FaunaRolePrivilege } from '~/../types/db'

export function Role(role: FaunaRoleOptions): FaunaRoleOptions {
  let { name, membership, privileges } = role || {}
  let self = {
    name,
    membership,
    privileges: privileges || [],
    setMembership(newMembership) {
      return Role({ name, privileges, membership: newMembership })
    },
    addPrivilege(newPrivilege: FaunaRolePrivilege) {
      return Role({ name, privileges: [...privileges.filter((p) => p.resource !== newPrivilege.resource), newPrivilege], membership })
    }
  }

  return self
}
