import { Expr } from 'faunadb';
import { FaunaRef, FaunaRoleMembership, FaunaRoleOptions, FaunaRolePrivilege, FaunaString } from '../fauna';
import { FactoryRuleDefinition, FactoryRuleDefinitionPaths } from './factory.rule';

export type FactoryRole<OT = FactoryRoleApi> = (name: FaunaString) => OT;

export interface FactoryRoleMembershipApi<OT = Expr> {
  distinct?(membership: FaunaRoleMembership): OT;
  distinctList?(membershipList: FaunaRoleMembership[]): OT;
  difference?(resource: FaunaRef): OT;
  differenceList?(resourceList: FaunaRef[]): OT;
  set(membership: FaunaRoleMembership): OT;
  setMany(membershipList: FaunaRoleMembership[]): OT;
  remove(resource: FaunaRef): OT;
  removeMany(resourceList: FaunaRef[]): OT;
}

export interface FactoryRolePrivilegeApi<OT = Expr> {
  distinct?(privilege: FaunaRolePrivilege): OT;
  distinctList?(privilegeList: FaunaRolePrivilege[]): OT;
  difference?(resource: FaunaRef): OT;
  differenceList?(resourceList: FaunaRef[]): OT;
  set(privilege: FaunaRolePrivilege): OT;
  setMany(privilegeList: FaunaRolePrivilege[]): OT;
  remove(resource: FaunaRef): OT;
  removeMany(resourceList: FaunaRef[]): OT;
}

export interface FactoryRoleApi<OT = Expr> {
  get(): OT;
  insert(options: FaunaRoleOptions): OT;
  update(options: FaunaRoleOptions): OT;
  upsert(options: FaunaRoleOptions): OT;
  replace(options: FaunaRoleOptions): OT;
  repsert(options: FaunaRoleOptions): OT;
  delete(): OT;
  forget(): OT;
  drop(): OT;
  remember(): OT;
  membership: FactoryRoleMembershipApi;
  privilege: FactoryRolePrivilegeApi;
  restore(): OT;
  expireAt(time: OT): OT;
  expireIn(delay: number | Expr): OT;
  expireNow(): OT;
}
