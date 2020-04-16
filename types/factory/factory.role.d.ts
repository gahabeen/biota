import { Expr } from 'faunadb';
import { FaunaRef, FaunaRoleMembership, FaunaRoleOptions, FaunaRolePrivilege } from '../fauna';

export type FactoryRole<OT = FactoryRoleApi> = (name: string | Expr) => OT;

export interface FactoryRoleMembershipApi<OT = Expr> {
  distinct(membership: FaunaRoleMembership): FaunaRoleMembership[] | OT;
  difference(resource: FaunaRef): FaunaRoleMembership[] | OT;
  set(membership: FaunaRoleMembership): OT;
  setMany(membershipList: FaunaRoleMembership[]): OT;
  remove(resource: FaunaRef): OT;
  removeMany(resourceList: FaunaRef[]): OT;
}

export interface FactoryRolePrivilegeApi<OT = Expr> {
  distinct(privilege: FaunaRolePrivilege): FaunaRolePrivilege[] | OT;
  difference(resource: FaunaRef): FaunaRolePrivilege[] | OT;
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
  membership: FactoryRoleMembershipApi;
  privilege: FactoryRolePrivilegeApi;
  restore(): OT;
  expireAt(time: OT): OT;
  expireIn(delay: number | Expr): OT;
  expireNow(): OT;
}
