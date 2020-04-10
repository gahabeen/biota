import { FaunaPaginateOptions, FaunaDocumentCredentials, FaunaRoleMembership, FaunaRef, FaunaRolePrivilege } from "../fauna";
import { Expr } from "faunadb";

export interface DBFrameworkRoleMembershipApi {
  upsert: (membership: FaunaRoleMembership) => Promise<any>;
  repsert: (membership: FaunaRoleMembership) => Promise<any>;
  delete: (resource: FaunaRef) => Promise<any>;
}

export interface DBFrameworkRolePrivilegeApi {
  upsert: (privilege: FaunaRolePrivilege) => Promise<any>;
  repsert: (privilege: FaunaRolePrivilege) => Promise<any>;
  delete: (resource: FaunaRef) =>Promise<any>;
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
