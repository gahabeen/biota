import { FaunaPaginateOptions, FaunaDocumentCredentials, FaunaRoleMembership, FaunaRef, FaunaRolePrivilege } from "../fauna";
import { Expr } from "faunadb";

export interface BiotaFrameworkRoleMembershipApi {
  upsert: (membership: FaunaRoleMembership) => Promise<any>;
  repsert: (membership: FaunaRoleMembership) => Promise<any>;
  delete: (resource: FaunaRef) => Promise<any>;
}

export interface BiotaFrameworkRolePrivilegeApi {
  upsert: (privilege: FaunaRolePrivilege) => Promise<any>;
  repsert: (privilege: FaunaRolePrivilege) => Promise<any>;
  delete: (resource: FaunaRef) =>Promise<any>;
}

export interface BiotaFrameworkRoleApi {
  activity: (pagination?: FaunaPaginateOptions) => Promise<any>;
  get: () => Promise<any>;
  insert: (options: object) => Promise<any>;
  replace: (options: object) => Promise<any>;
  update: (options: object) => Promise<any>;
  repsert: (options: object) => Promise<any>;
  upsert: (options: object) => Promise<any>;
  delete: () => Promise<any>;
  forget: () => Promise<any>;
  membership: BiotaFrameworkRoleMembershipApi;
  privilege: BiotaFrameworkRolePrivilegeApi;
  changes: () => Promise<any>;
}
