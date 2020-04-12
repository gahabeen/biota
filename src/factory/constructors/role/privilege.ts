import { query as q } from 'faunadb';
import { Fauna, FaunaRolePrivilege, FaunaRolePrivilegeDefault } from '~/../types/fauna';
import {
  CallAction,
  CreateAction,
  DeleteAction,
  HistoryReadAction,
  HistoryWriteAction,
  ReadAction,
  UnrestrictedReadAction,
  WriteAction,
} from './action';

export function CustomPrivilege(privilege: FaunaRolePrivilege): FaunaRolePrivilege {
  let { resource, actions } = privilege || {};
  return {
    resource,
    actions,
  };
}

function QueryWrapper(expr: Fauna.Expr) {
  if (typeof expr === 'boolean') {
    return expr;
  } else {
    return q.Query(expr);
  }
}

export function Privilege(privilege: FaunaRolePrivilegeDefault): FaunaRolePrivilege {
  let { resource, actions = {} } = privilege || {};

  let processedActions = {
    create: QueryWrapper(CreateAction(actions.create)),
    delete: QueryWrapper(DeleteAction(actions.delete)),
    read: QueryWrapper(ReadAction(actions.read)),
    write: QueryWrapper(WriteAction(actions.write)),
    history_write: QueryWrapper(HistoryWriteAction(actions.history_read)),
    history_read: QueryWrapper(HistoryReadAction(actions.history_read)),
    unrestricted_read: QueryWrapper(UnrestrictedReadAction(actions.unrestricted_read)),
    call: QueryWrapper(CallAction(actions.call)),
  };

  let filteredActions = {};
  for (let action in actions) {
    filteredActions[action] = processedActions[action];
  }

  // console.log("filteredActions", resource, filteredActions);

  let result = {
    resource,
    actions: filteredActions,
  };
  return result;
}
