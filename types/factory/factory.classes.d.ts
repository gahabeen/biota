import { Expr } from "faunadb";
import {
  CRUDReferenceCollection,
  CRUDReferenceCredentials,
  CRUDReferenceDatabase,
  CRUDReferenceDocument,
  CRUDReferenceIndex,
  CRUDReferenceKey,
  CRUDReferenceRole,
  CRUDReferenceToken,
  CRUDReferenceUDFunction,
} from "../crud.reference";
import { FaunaDocumentOptions, FaunaId, FaunaRoleMembership, FaunaRolePrivilege, FaunaRef } from "../fauna";

export interface DBFactoryDocumentApi {
  login(collection: string, id: FaunaId, password: string): Expr;
  credentials(collection: string, id: FaunaId, credentials: FaunaDocumentOptions["credentials"]): Expr;
  changePassword(collection: string, id: FaunaId, password: string): Expr;
  get: CRUDReferenceDocument["read"];
  insert: CRUDReferenceDocument["create"];
  update: CRUDReferenceDocument["update"];
  replace: CRUDReferenceDocument["update"];
  upsert: CRUDReferenceDocument["upsert"];
  repsert: CRUDReferenceDocument["upsert"];
  delete: CRUDReferenceDocument["delete"];
  forget: CRUDReferenceDocument["delete"];
  expireIn: CRUDReferenceDocument["expireIn"];
  expireAt: CRUDReferenceDocument["expireAt"];
  expireNow: CRUDReferenceDocument["expireNow"];
}

export interface DBFactoryCollectionApi {
  all: CRUDReferenceCollection["readAll"];
  get: CRUDReferenceCollection["read"];
  insert: CRUDReferenceCollection["create"];
  update: CRUDReferenceCollection["update"];
  replace: CRUDReferenceCollection["update"];
  upsert: CRUDReferenceCollection["upsert"];
  repsert: CRUDReferenceCollection["upsert"];
  delete: CRUDReferenceCollection["delete"];
  forget: CRUDReferenceCollection["delete"];
  clean: CRUDReferenceDocument["cleanAll"];
  cleanAll: CRUDReferenceCollection["cleanAll"];
}

// export interface DBFactoryCollectionMethodApi {
//   insert?(options?: FaunaDocumentOptions, id?: FaunaId): Expr;
//   get?(id: FaunaId, options?: CRUDReferenceDocumentReadOptions): Expr;
//   all?(pagination?: FaunaPaginateOptions): Expr;
//   update?(id: FaunaId, options: FaunaDocumentOptions): Expr;
//   upsert?(id: FaunaId, options: FaunaDocumentOptions): Expr;
//   replace?(id: FaunaId, options: FaunaDocumentOptions): Expr;
//   repsert?(id: FaunaId, options: FaunaDocumentOptions): Expr;
//   delete?(id: FaunaId): Expr;
//   expire?(id: FaunaId, at: FaunaTime): Expr;
//   own?(id: FaunaId, newOwner: FaunaRef): Expr;
//   assign?(id: FaunaId, newAssignee: FaunaRef): Expr;
//   unassign?(id: FaunaId, newAssignee: FaunaRef): Expr;
// }

export interface DBFactoryDatabaseApi {
  all: CRUDReferenceDatabase["readAll"];
  get: CRUDReferenceDatabase["read"];
  insert: CRUDReferenceDatabase["create"];
  update: CRUDReferenceDatabase["update"];
  replace: CRUDReferenceDatabase["update"];
  upsert: CRUDReferenceDatabase["upsert"];
  repsert: CRUDReferenceDatabase["upsert"];
  delete: CRUDReferenceDatabase["delete"];
  forget: CRUDReferenceDatabase["delete"];
  cleanAll: CRUDReferenceDatabase["cleanAll"];
  clean: CRUDReferenceDatabase["delete"];
}

export interface DBFactoryIndexApi {
  all: CRUDReferenceIndex["readAll"];
  get: CRUDReferenceIndex["read"];
  insert: CRUDReferenceIndex["create"];
  update: CRUDReferenceIndex["update"];
  replace: CRUDReferenceIndex["update"];
  upsert: CRUDReferenceIndex["upsert"];
  repsert: CRUDReferenceIndex["upsert"];
  delete: CRUDReferenceIndex["delete"];
  forget: CRUDReferenceIndex["delete"];
  cleanAll: CRUDReferenceIndex["cleanAll"];
}

export interface DBFactoryCallunctionApi {
  all: CRUDReferenceUDFunction["readAll"];
  get: CRUDReferenceUDFunction["read"];
  insert: CRUDReferenceUDFunction["create"];
  update: CRUDReferenceUDFunction["update"];
  replace: CRUDReferenceUDFunction["update"];
  upsert: CRUDReferenceUDFunction["upsert"];
  repsert: CRUDReferenceUDFunction["upsert"];
  delete: CRUDReferenceUDFunction["delete"];
  forget: CRUDReferenceUDFunction["delete"];
  cleanAll: CRUDReferenceUDFunction["cleanAll"];
  clean: CRUDReferenceUDFunction["delete"];
}

export interface DBFactoryRoleMembershipApi {
  upsert: (name: string, membership: FaunaRoleMembership) => Expr;
  delete: (name: string, resource: FaunaRef) => Expr;
}

export interface DBFactoryRolePrivilegeApi {
  upsert: (name: string, membership: FaunaRolePrivilege) => Expr;
  delete: (name: string, resource: FaunaRef) => Expr;
}

export interface DBFactoryRoleApi {
  all: CRUDReferenceRole["readAll"];
  get: CRUDReferenceRole["read"];
  insert: CRUDReferenceRole["create"];
  update: CRUDReferenceRole["update"];
  replace: CRUDReferenceRole["update"];
  upsert: CRUDReferenceRole["upsert"];
  repsert: CRUDReferenceRole["upsert"];
  delete: CRUDReferenceRole["delete"];
  forget: CRUDReferenceRole["delete"];
  membership: DBFactoryRoleMembershipApi;
  privilege: DBFactoryRolePrivilegeApi;
  cleanAll: CRUDReferenceIndex["cleanAll"];
  clean: CRUDReferenceIndex["delete"];
}

export interface DBFactoryTokenApi {
  all: CRUDReferenceToken["readAll"];
  get: CRUDReferenceToken["read"];
  insert: CRUDReferenceToken["create"];
  update: CRUDReferenceToken["update"];
  replace: CRUDReferenceToken["update"];
  upsert: CRUDReferenceToken["upsert"];
  repsert: CRUDReferenceToken["upsert"];
  delete: CRUDReferenceToken["delete"];
  forget: CRUDReferenceToken["delete"];
  cleanAll: CRUDReferenceIndex["cleanAll"];
}

export interface DBFactoryKeyApi {
  all: CRUDReferenceKey["readAll"];
  get: CRUDReferenceKey["read"];
  insert: CRUDReferenceKey["create"];
  update: CRUDReferenceKey["update"];
  replace: CRUDReferenceKey["update"];
  upsert: CRUDReferenceKey["upsert"];
  repsert: CRUDReferenceKey["upsert"];
  delete: CRUDReferenceKey["delete"];
  forget: CRUDReferenceKey["delete"];
  cleanAll: CRUDReferenceIndex["cleanAll"];
}

export interface DBFactoryCredentialsApi {
  all: CRUDReferenceCredentials["readAll"];
  update: CRUDReferenceCredentials["update"];
}
