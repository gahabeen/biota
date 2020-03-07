import { FaunaRolePrivilege } from '~/types'

export function Privilege(privilege: FaunaRolePrivilege): FaunaRolePrivilege {
  let { resource, actions } = privilege || {}
  return {
    resource,
    actions
  }
}
