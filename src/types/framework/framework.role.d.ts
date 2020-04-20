import { FaunaPaginateOptions, FaunaRolePrivilegeActions } from '../fauna';
import { FactoryRoleApi, FactoryRole, FactoryRolePrivilegeApi } from '~/types/factory/factory.role';
import { Expr } from 'faunadb';
import { FactoryRuleDefinition, FactoryRuleDefinitionPaths } from '../factory/factory.rule';

export type FrameworkRole = FactoryRole<FrameworkRoleApi>;

export interface FaunaRolePrivilegeScaffoldOptions {
  resource?: Expr;
  rights?: FactoryRuleDefinition;
  actions?: FaunaRolePrivilegeActions;
  immutablePaths?: FactoryRuleDefinitionPaths;
}

export interface FrameworkRolePrivilegeApi extends FactoryRolePrivilegeApi<Promise<any>> {
  scaffold(privilege: FaunaRolePrivilegeScaffoldOptions): Promise<any>;
  scaffoldMany(privilege: FaunaRolePrivilegeScaffoldOptions[]): Promise<any>;
}

export interface FrameworkRoleApi {
  activity: (pagination?: FaunaPaginateOptions) => Promise<any>;
  get: FactoryRoleApi<Promise<any>>['get'];
  insert: FactoryRoleApi<Promise<any>>['insert'];
  update: FactoryRoleApi<Promise<any>>['update'];
  upsert: FactoryRoleApi<Promise<any>>['upsert'];
  replace: FactoryRoleApi<Promise<any>>['replace'];
  repsert: FactoryRoleApi<Promise<any>>['repsert'];
  delete: FactoryRoleApi<Promise<any>>['delete'];
  forget: FactoryRoleApi<Promise<any>>['forget'];
  drop: FactoryRoleApi<Promise<any>>['drop'];
  remember: FactoryRoleApi<Promise<any>>['remember'];
  restore: FactoryRoleApi<Promise<any>>['restore'];
  expireAt: FactoryRoleApi<Promise<any>>['expireAt'];
  expireIn: FactoryRoleApi<Promise<any>>['expireIn'];
  expireNow: FactoryRoleApi<Promise<any>>['expireNow'];
  membership: FactoryRoleApi<Promise<any>>['membership'];
  privilege: FrameworkRolePrivilegeApi;
}
