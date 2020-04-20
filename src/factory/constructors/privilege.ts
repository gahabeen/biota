import { FaunaRolePrivilege } from '~/types/fauna';
import { FaunaRolePrivilegeScaffoldOptions } from '~/types/framework/framework.role';
import { PrivilegeRights } from './privilege_rights';

export function CustomPrivilege(privilege: FaunaRolePrivilege): FaunaRolePrivilege {
  const { resource, actions } = privilege || {};
  return {
    resource,
    actions,
  };
}

export function Privilege(options: FaunaRolePrivilegeScaffoldOptions): FaunaRolePrivilege {
  const { resource, actions = {}, rights = {}, immutablePaths = {} } = options || {};
  const transpiledActions = PrivilegeRights(rights, immutablePaths);
  const mergedActions = { ...transpiledActions, ...actions };

  return {
    resource,
    actions: mergedActions,
    // data: {
    //   rights,
    //   actions,
    //   immutablePaths,
    // },
  };
}
