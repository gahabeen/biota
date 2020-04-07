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

export interface DBFactoryUDF {
  get: DBFactoryUDFGet;
  insert: DBFactoryUDFInsert;
  update: DBFactoryUDFUpdate;
  upsert: DBFactoryUDFUpsert;
  replace: DBFactoryUDFReplace;
  repsert: DBFactoryUDFRepsert;
  delete: DBFactoryUDFDelete;
  forget: DBFactoryUDFForget;
  clean: DBFactoryUDFClean;
  user: DBFactoryUDFUser
}

export interface DBFactoryUDFOwn {
  document: CRUDReferenceDocument["own"];
}

export interface DBFactoryUDFAssign {
  document: CRUDReferenceDocument["assign"];
}

export interface DBFactoryUDFUnAssign {
  document: CRUDReferenceDocument["unassign"];
}

export interface DBFactoryUDFExpire {
  documentAt: CRUDReferenceDocument["expireAt"];
  documentIn: CRUDReferenceDocument["expireIn"];
  documentNow: CRUDReferenceDocument["expireNow"];
}

export interface DBFactoryUDFGet {
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

export interface DBFactoryUDFInsert {
  document: CRUDReferenceDocument["create"];
  database: CRUDReferenceDatabase["create"];
  collection: CRUDReferenceCollection["create"];
  index: CRUDReferenceIndex["create"];
  udfunction: CRUDReferenceUDFunction["create"];
  role: CRUDReferenceRole["create"];
  token: CRUDReferenceToken["create"];
  key: CRUDReferenceKey["create"];
}

export interface DBFactoryUDFUpdate {
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

export interface DBFactoryUDFUpsert {
  document: CRUDReferenceDocument["update"];
  database: CRUDReferenceDatabase["update"];
  collection: CRUDReferenceCollection["update"];
  index: CRUDReferenceIndex["update"];
  udfunction: CRUDReferenceUDFunction["update"];
  role: CRUDReferenceRole["update"];
  token: CRUDReferenceToken["update"];
  key: CRUDReferenceKey["update"];
}

export interface DBFactoryUDFReplace {
  document: CRUDReferenceDocument["update"];
  database: CRUDReferenceDatabase["update"];
  collection: CRUDReferenceCollection["update"];
  index: CRUDReferenceIndex["update"];
  udfunction: CRUDReferenceUDFunction["update"];
  role: CRUDReferenceRole["update"];
  token: CRUDReferenceToken["update"];
  key: CRUDReferenceKey["update"];
}
export interface DBFactoryUDFRepsert {
  document: CRUDReferenceDocument["update"];
  database: CRUDReferenceDatabase["update"];
  collection: CRUDReferenceCollection["update"];
  index: CRUDReferenceIndex["update"];
  udfunction: CRUDReferenceUDFunction["update"];
  role: CRUDReferenceRole["update"];
  token: CRUDReferenceToken["update"];
  key: CRUDReferenceKey["update"];
}

export interface DBFactoryUDFDelete {
  document: CRUDReferenceDocument["delete"];
  database: CRUDReferenceDatabase["delete"];
  collection: CRUDReferenceCollection["delete"];
  index: CRUDReferenceIndex["delete"];
  udfunction: CRUDReferenceUDFunction["delete"];
  role: CRUDReferenceRole["delete"];
  token: CRUDReferenceToken["delete"];
  key: CRUDReferenceKey["delete"];
}

export interface DBFactoryUDFForget {
  document: CRUDReferenceDocument["delete"];
  database: CRUDReferenceDatabase["delete"];
  collection: CRUDReferenceCollection["delete"];
  index: CRUDReferenceIndex["delete"];
  udfunction: CRUDReferenceUDFunction["delete"];
  role: CRUDReferenceRole["delete"];
  token: CRUDReferenceToken["delete"];
  key: CRUDReferenceKey["delete"];
}

export interface DBFactoryUDFClean {
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

export interface DBFactoryUDFUser {
  login: DBFactorySpecificUserApi["login"];
  register: DBFactorySpecificUserApi["register"];
  changePassword: DBFactorySpecificUserApi["changePassword"];
}
