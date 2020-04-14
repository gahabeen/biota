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
  const { resource, actions } = privilege || {};
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

export function BiotaPrivilege(privilege: FaunaRolePrivilegeDefault): FaunaRolePrivilege {
  const { resource, actions = {} } = privilege || {};

  const defaultActions = {
    self: {
      immutablePaths: [],
      get: false,
      getHistory: false,
      insert: false,
      insertHistory: false,
      update: false,
      replace: false,
      delete: false,
      expire: false,
      forget: false,
      restore: false,
      setOwner: false,
      removeOwner: false,
      setAssignee: false,
      removeAssignee: false,
      setRole: false,
      removeRole: false,
    },
    owner: {
      immutablePaths: [],
      get: false,
      getHistory: false,
      insert: false,
      insertHistory: false,
      update: false,
      replace: false,
      delete: false,
      expire: false,
      forget: false,
      restore: false,
      setOwner: false,
      removeOwner: false,
      setAssignee: false,
      removeAssignee: false,
      setRole: false,
      removeRole: false,
    },
    assignee: {
      immutablePaths: [],
      get: false,
      getHistory: false,
      insert: false,
      insertHistory: false,
      update: false,
      replace: false,
      delete: false,
      expire: false,
      forget: false,
      restore: false,
      setOwner: false,
      removeOwner: false,
      setAssignee: false,
      removeAssignee: false,
      setRole: false,
      removeRole: false,
    },
  };

  let transpiledActions = {};

  const result = {
    resource,
    actions: transpiledActions,
  };
  return result;
}

export function Privilege(privilege: FaunaRolePrivilegeDefault): FaunaRolePrivilege {
  const { resource, actions = {} } = privilege || {};

  const processedActions = {
    create: QueryWrapper(CreateAction(actions.create)),
    delete: QueryWrapper(DeleteAction(actions.delete)),
    read: QueryWrapper(ReadAction(actions.read)),
    write: QueryWrapper(WriteAction(actions.write)),
    history_write: QueryWrapper(HistoryWriteAction(actions.history_read)),
    history_read: QueryWrapper(HistoryReadAction(actions.history_read)),
    unrestricted_read: QueryWrapper(UnrestrictedReadAction(actions.unrestricted_read)),
    call: QueryWrapper(CallAction(actions.call)),
  };

  const filteredActions = {};
  for (const action in actions) {
    filteredActions[action] = processedActions[action];
  }

  // console.log("filteredActions", resource, filteredActions);

  const result = {
    resource,
    actions: filteredActions,
  };
  return result;
}
