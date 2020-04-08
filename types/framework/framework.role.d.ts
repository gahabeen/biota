import { FaunaPaginateOptions, FaunaDocumentCredentials, FaunaRoleMembership, FaunaRef, FaunaRolePrivilege } from "../fauna";
import { Expr } from "faunadb";

export interface DBFrameworkRoleMembershipApi {
  upsert: (membership: FaunaRoleMembership) => Expr;
  delete: (resource: FaunaRef) => Expr;
}

export interface DBFrameworkRolePrivilegeApi {
  upsert: (privilege: FaunaRolePrivilege) => Expr;
  delete: (resource: FaunaRef) => Expr;
}

export interface DBFrameworkRoleApi {
  activity: (pagination?: FaunaPaginateOptions) => Promise<any>;
  get: () => Promise<any>;
  insert: (options: object) => Promise<any>;
  replace: (options: object) => Promise<any>;
  update: (options: object) => Promise<any>;
  repsert: (options: object) => Promise<any>;
  upsert: (options: object) => Promise<any>;
  delete: () => Promise<any>;
  forget: () => Promise<any>;
  membership: DBFrameworkRoleMembershipApi;
  privilege: DBFrameworkRolePrivilegeApi;
  changes: () => Promise<any>;
}
