import { Expr } from 'faunadb';
import { FaunaRef, FaunaRoleMembership, FaunaRoleOptions, FaunaRolePrivilege } from '../fauna';

export type FactoryRole = (name: string | Expr) => FactoryRoleApi;

export interface FactoryRolePrivilegeApi {
  distinct(membership: FaunaRoleMembership): FaunaRoleMembership[] | Expr;
  difference(resource: FaunaRef): FaunaRoleMembership[] | Expr;
  set: (membership: FaunaRoleMembership) => Expr;
  remove: (resource: FaunaRef) => Expr;
}

export interface FactoryRoleMembershipApi {
  distinct(privilege: FaunaRolePrivilege): FaunaRolePrivilege[] | Expr;
  difference(resource: FaunaRef): FaunaRolePrivilege[] | Expr;
  set: (membership: FaunaRolePrivilege) => Expr;
  remove: (resource: FaunaRef) => Expr;
}

export interface FactoryRoleApi {
  get(): Expr;
  insert(options: FaunaRoleOptions): Expr;
  update(options: FaunaRoleOptions): Expr;
  upsert(options: FaunaRoleOptions): Expr;
  replace(options: FaunaRoleOptions): Expr;
  repsert(options: FaunaRoleOptions): Expr;
  delete(): Expr;
  forget(): Expr;
  clean(): Expr;
  membership: FactoryRoleMembershipApi;
  privileges: FactoryRolePrivilegeApi;
}
