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
import { DBFactorySpecificUserApi } from "./factory.specific.user";

export interface DBFactoryCall {
  get: DBFactoryCallGet;
  insert: DBFactoryCallInsert;
  update: DBFactoryCallUpdate;
  upsert: DBFactoryCallUpsert;
  replace: DBFactoryCallReplace;
  repsert: DBFactoryCallRepsert;
  delete: DBFactoryCallDelete;
  forget: DBFactoryCallForget;
  clean: DBFactoryCallClean;
  user: DBFactoryCallUser;
}

export interface DBFactoryCallOwn {
  document: CRUDReferenceDocument["own"];
}

export interface DBFactoryCallAssign {
  document: CRUDReferenceDocument["assign"];
}

export interface DBFactoryCallUnAssign {
  document: CRUDReferenceDocument["unassign"];
}

export interface DBFactoryCallExpire {
  documentAt: CRUDReferenceDocument["expireAt"];
  documentIn: CRUDReferenceDocument["expireIn"];
  documentNow: CRUDReferenceDocument["expireNow"];
}

export interface DBFactoryCallGet {
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

export interface DBFactoryCallInsert {
  document: CRUDReferenceDocument["create"];
  database: CRUDReferenceDatabase["create"];
  collection: CRUDReferenceCollection["create"];
  index: CRUDReferenceIndex["create"];
  udfunction: CRUDReferenceUDFunction["create"];
  role: CRUDReferenceRole["create"];
  token: CRUDReferenceToken["create"];
  key: CRUDReferenceKey["create"];
}

export interface DBFactoryCallUpdate {
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

export interface DBFactoryCallUpsert {
  document: CRUDReferenceDocument["update"];
  database: CRUDReferenceDatabase["update"];
  collection: CRUDReferenceCollection["update"];
  index: CRUDReferenceIndex["update"];
  udfunction: CRUDReferenceUDFunction["update"];
  role: CRUDReferenceRole["update"];
  token: CRUDReferenceToken["update"];
  key: CRUDReferenceKey["update"];
}

export interface DBFactoryCallReplace {
  document: CRUDReferenceDocument["update"];
  database: CRUDReferenceDatabase["update"];
  collection: CRUDReferenceCollection["update"];
  index: CRUDReferenceIndex["update"];
  udfunction: CRUDReferenceUDFunction["update"];
  role: CRUDReferenceRole["update"];
  token: CRUDReferenceToken["update"];
  key: CRUDReferenceKey["update"];
}
export interface DBFactoryCallRepsert {
  document: CRUDReferenceDocument["update"];
  database: CRUDReferenceDatabase["update"];
  collection: CRUDReferenceCollection["update"];
  index: CRUDReferenceIndex["update"];
  udfunction: CRUDReferenceUDFunction["update"];
  role: CRUDReferenceRole["update"];
  token: CRUDReferenceToken["update"];
  key: CRUDReferenceKey["update"];
}

export interface DBFactoryCallDelete {
  document: CRUDReferenceDocument["delete"];
  database: CRUDReferenceDatabase["delete"];
  collection: CRUDReferenceCollection["delete"];
  index: CRUDReferenceIndex["delete"];
  udfunction: CRUDReferenceUDFunction["delete"];
  role: CRUDReferenceRole["delete"];
  token: CRUDReferenceToken["delete"];
  key: CRUDReferenceKey["delete"];
}

export interface DBFactoryCallForget {
  document: CRUDReferenceDocument["delete"];
  database: CRUDReferenceDatabase["delete"];
  collection: CRUDReferenceCollection["delete"];
  index: CRUDReferenceIndex["delete"];
  udfunction: CRUDReferenceUDFunction["delete"];
  role: CRUDReferenceRole["delete"];
  token: CRUDReferenceToken["delete"];
  key: CRUDReferenceKey["delete"];
}

export interface DBFactoryCallClean {
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

export interface DBFactoryCallUser {
  login: DBFactorySpecificUserApi["login"];
  logout: DBFactorySpecificUserApi["logout"];
  register: DBFactorySpecificUserApi["register"];
  changePassword: DBFactorySpecificUserApi["changePassword"];
}
