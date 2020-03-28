// types
import { FaunaRolePrivilege, FaunaRolePrivilegeDefault } from "~/../types/db";
// external
import { query as q } from "faunadb";
// biota
import {
  CreateAction,
  DeleteAction,
  ReadAction,
  WriteAction,
  HistoryReadAction,
  HistoryWriteAction,
  UnrestrictedReadAction,
  CallAction
} from "./action";

export function CustomPrivilege(
  privilege: FaunaRolePrivilege
): FaunaRolePrivilege {
  let { resource, actions } = privilege || {};
  return {
    resource,
    actions
  };
}

export function Privilege(
  privilege: FaunaRolePrivilegeDefault
): FaunaRolePrivilege {
  let { resource, actions = {} } = privilege || {};

  let processedActions = {
    create: q.Query(CreateAction(actions.create)),
    delete: q.Query(DeleteAction(actions.delete)),
    read: q.Query(ReadAction(actions.read)),
    write: q.Query(WriteAction(actions.write)),
    history_write: q.Query(HistoryWriteAction(actions.history_read)),
    history_read: q.Query(HistoryReadAction(actions.history_read)),
    unrestricted_read: q.Query(
      UnrestrictedReadAction(actions.unrestricted_read)
    ),
    call: q.Query(CallAction(actions.call))
  };

  let filteredActions = {};
  for (let action in actions) {
    filteredActions[action] = processedActions[action];
  }

  let result = {
    resource,
    actions: filteredActions
  };

  return result;
}
