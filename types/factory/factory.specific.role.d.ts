import { Expr } from "faunadb";
import { FaunaId, FaunaDocumentOptions, FaunaRoleMembership, FaunaRef, FaunaRolePrivilege } from "../fauna";

export interface DBFactorySpecificRoleMembershipApi {
  upsert: (name: string, membership: FaunaRoleMembership) => Expr;
  delete: (name: string, resource: FaunaRef) => Expr;
}

export interface DBFactorySpecificRolePrivilegeApi {
  upsert: (name: string, membership: FaunaRolePrivilege) => Expr;
  delete: (name: string, resource: FaunaRef) => Expr;
}

export interface DBFactorySpecificRoleApi {
  membership: DBFactorySpecificRoleMembershipApi;
  privilege: DBFactorySpecificRolePrivilegeApi;
}
