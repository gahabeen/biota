import {
  CRUDReferenceDocument,
  CRUDReferenceDatabase,
  CRUDReferenceCollection,
  CRUDReferenceIndex,
  CRUDReferenceUDFunction,
  CRUDReferenceRole,
  CRUDReferenceToken,
  CRUDReferenceKey,
  CRUDReferenceCredentials,
} from "../crud.reference";
import { FaunaRoleMembership, FaunaRolePrivilege, FaunaRef } from "../fauna";
import { Expr } from "faunadb";
import { DBFactorySpecificRoleMembershipApi, DBFactorySpecificRolePrivilegeApi } from "./factory.specific.role";

export interface DBFactoryFQLBase {
  get: DBFactoryFQLBaseGet;
  insert: DBFactoryFQLBaseInsert;
  update: DBFactoryFQLBaseUpdate;
  upsert: DBFactoryFQLBaseUpsert;
  replace: DBFactoryFQLBaseReplace;
  repsert: DBFactoryFQLBaseRepsert;
  delete: DBFactoryFQLBaseDelete;
  forget: DBFactoryFQLBaseForget;
  clean: DBFactoryFQLBaseClean;
}

export interface DBFactoryFQLBaseGet {
  document: CRUDReferenceDocument["read"];
  // documents: CRUDReferenceDocument["readAll"];
  database: CRUDReferenceDatabase["read"];
  databases: CRUDReferenceDatabase["readAll"];
  collection: CRUDReferenceCollection["read"];
  collections: CRUDReferenceCollection["readAll"];
  index: CRUDReferenceIndex["read"];
  indexes: CRUDReferenceIndex["readAll"];
  udfunction: CRUDReferenceUDFunction["read"];
  udfunctions: CRUDReferenceUDFunction["readAll"];
  role: CRUDReferenceRole["read"];
  roles: CRUDReferenceRole["readAll"];
  token: CRUDReferenceToken["read"];
  tokens: CRUDReferenceToken["readAll"];
  key: CRUDReferenceKey["read"];
  keys: CRUDReferenceKey["readAll"];
  credentials: CRUDReferenceCredentials["readAll"];
}

export interface DBFactoryFQLBaseInsert {
  document: CRUDReferenceDocument["create"];
  database: CRUDReferenceDatabase["create"];
  collection: CRUDReferenceCollection["create"];
  index: CRUDReferenceIndex["create"];
  udfunction: CRUDReferenceUDFunction["create"];
  role: CRUDReferenceRole["create"];
  token: CRUDReferenceToken["create"];
  key: CRUDReferenceKey["create"];
}

export interface DBFactoryFQLBaseUpdate {
  document: CRUDReferenceDocument["update"];
  database: CRUDReferenceDatabase["update"];
  collection: CRUDReferenceCollection["update"];
  index: CRUDReferenceIndex["update"];
  udfunction: CRUDReferenceUDFunction["update"];
  role: CRUDReferenceRole["update"];
  token: CRUDReferenceToken["update"];
  key: CRUDReferenceKey["update"];
  credentials: CRUDReferenceCredentials["update"];
}

export interface DBFactoryFQLBaseUpsert {
  document: CRUDReferenceDocument["upsert"];
  database: CRUDReferenceDatabase["upsert"];
  collection: CRUDReferenceCollection["upsert"];
  index: CRUDReferenceIndex["upsert"];
  udfunction: CRUDReferenceUDFunction["upsert"];
  role: CRUDReferenceRole["upsert"];
  token: CRUDReferenceToken["upsert"];
  key: CRUDReferenceKey["upsert"];
}

export interface DBFactoryFQLBaseReplace {
  document: CRUDReferenceDocument["update"];
  database: CRUDReferenceDatabase["update"];
  collection: CRUDReferenceCollection["update"];
  index: CRUDReferenceIndex["update"];
  udfunction: CRUDReferenceUDFunction["update"];
  role: CRUDReferenceRole["update"];
  token: CRUDReferenceToken["update"];
  key: CRUDReferenceKey["update"];
}
export interface DBFactoryFQLBaseRepsert {
  document: CRUDReferenceDocument["update"];
  database: CRUDReferenceDatabase["update"];
  collection: CRUDReferenceCollection["update"];
  index: CRUDReferenceIndex["update"];
  udfunction: CRUDReferenceUDFunction["update"];
  role: CRUDReferenceRole["update"];
  token: CRUDReferenceToken["update"];
  key: CRUDReferenceKey["update"];
}

export interface DBFactoryFQLBaseDelete {
  document: CRUDReferenceDocument["delete"];
  database: CRUDReferenceDatabase["delete"];
  collection: CRUDReferenceCollection["delete"];
  index: CRUDReferenceIndex["delete"];
  udfunction: CRUDReferenceUDFunction["delete"];
  role: CRUDReferenceRole["delete"];
  token: CRUDReferenceToken["delete"];
  key: CRUDReferenceKey["delete"];
}

export interface DBFactoryFQLBaseForget {
  document: CRUDReferenceDocument["delete"];
  database: CRUDReferenceDatabase["delete"];
  collection: CRUDReferenceCollection["delete"];
  index: CRUDReferenceIndex["delete"];
  udfunction: CRUDReferenceUDFunction["delete"];
  role: CRUDReferenceRole["delete"];
  token: CRUDReferenceToken["delete"];
  key: CRUDReferenceKey["delete"];
}

export interface DBFactoryFQLBaseClean {
  document: CRUDReferenceDocument["delete"];
  documents: CRUDReferenceDocument["cleanAll"];
  database: CRUDReferenceDatabase["delete"];
  databases: CRUDReferenceDatabase["cleanAll"];
  collection: CRUDReferenceCollection["delete"];
  collections: CRUDReferenceCollection["cleanAll"];
  index: CRUDReferenceIndex["delete"];
  indexes: CRUDReferenceIndex["cleanAll"];
  udfunction: CRUDReferenceUDFunction["delete"];
  udfunctions: CRUDReferenceUDFunction["cleanAll"];
  role: CRUDReferenceRole["delete"];
  roles: CRUDReferenceRole["cleanAll"];
  token: CRUDReferenceToken["delete"];
  tokens: CRUDReferenceToken["cleanAll"];
  key: CRUDReferenceKey["delete"];
  keys: CRUDReferenceKey["cleanAll"];
}

export interface DBFactoryFQLBaseRoleMembership {
  distinct(name: string, membership: FaunaRoleMembership): FaunaRoleMembership[] | Expr;
  difference(name: string, resource: FaunaRef): FaunaRoleMembership[] | Expr;
  upsert: DBFactorySpecificRoleMembershipApi["upsert"];
  repsert: DBFactorySpecificRoleMembershipApi["repsert"];
  delete: DBFactorySpecificRoleMembershipApi["delete"];
}

export interface DBFactoryFQLBaseRolePrivilege {
  distinct(name: string, privilege: FaunaRolePrivilege): FaunaRolePrivilege[] | Expr;
  difference(name: string, resource: FaunaRef): FaunaRolePrivilege[] | Expr;
  upsert: DBFactorySpecificRolePrivilegeApi["upsert"];
  repsert: DBFactorySpecificRolePrivilegeApi["repsert"];
  delete: DBFactorySpecificRolePrivilegeApi["delete"];
}

export interface DBFactoryFQLBaseRole {
  membership: DBFactoryFQLBaseRoleMembership;
  privileges: DBFactoryFQLBaseRolePrivilege;
}
