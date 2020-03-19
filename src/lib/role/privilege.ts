// types
import { FaunaRolePrivilege, FaunaRolePrivilegeDefault } from '../../types'
// biota
import { CreateAction, DeleteAction, ReadAction, WriteAction, HistoryReadAction, HistoryWriteAction, UnrestrictedReadAction, CallAction } from './action'

export function CustomPrivilege(privilege: FaunaRolePrivilege): FaunaRolePrivilege {
  let { resource, actions } = privilege || {}
  return {
    resource,
    actions
  }
}

export function Privilege(privilege: FaunaRolePrivilegeDefault): FaunaRolePrivilege {
  let { resource, actions = {} } = privilege || {}
  return {
    resource,
    actions: {
      create: CreateAction(actions.create),
      delete: DeleteAction(actions.delete),
      read: ReadAction(actions.read),
      write: WriteAction(actions.write),
      history_write: HistoryWriteAction(actions.history_read),
      history_read: HistoryReadAction(actions.history_read),
      unrestricted_read: UnrestrictedReadAction(actions.unrestricted_read),
      call: CallAction(actions.call)
    }
  }
}
