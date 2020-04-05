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

export interface DBFactoryFQLUDF {
  get: DBFactoryFQLUDFGet;
  insert: DBFactoryFQLUDFInsert;
  update: DBFactoryFQLUDFUpdate;
  upsert: DBFactoryFQLUDFUpsert;
  replace: DBFactoryFQLUDFReplace;
  repsert: DBFactoryFQLUDFRepsert;
  delete: DBFactoryFQLUDFDelete;
  forget: DBFactoryFQLUDFForget;
}

export interface DBFactoryFQLUDFAssign {
  document: CRUDReferenceDocument["assign"];
}

export interface DBFactoryFQLUDFUnAssign {
  document: CRUDReferenceDocument["unassign"];
}

export interface DBFactoryFQLUDFOwn {
  document: CRUDReferenceDocument["own"];
}

export interface DBFactoryFQLUDFExpire {
  document: CRUDReferenceDocument["expire"];
}

export interface DBFactoryFQLUDFGet {
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

export interface DBFactoryFQLUDFInsert {
  document: CRUDReferenceDocument["create"];
  database: CRUDReferenceDatabase["create"];
  collection: CRUDReferenceCollection["create"];
  index: CRUDReferenceIndex["create"];
  udfunction: CRUDReferenceUDFunction["create"];
  role: CRUDReferenceRole["create"];
  token: CRUDReferenceToken["create"];
  key: CRUDReferenceKey["create"];
}

export interface DBFactoryFQLUDFUpdate {
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

export interface DBFactoryFQLUDFUpsert {
  document: CRUDReferenceDocument["update"];
  database: CRUDReferenceDatabase["update"];
  collection: CRUDReferenceCollection["update"];
  index: CRUDReferenceIndex["update"];
  udfunction: CRUDReferenceUDFunction["update"];
  role: CRUDReferenceRole["update"];
  token: CRUDReferenceToken["update"];
  key: CRUDReferenceKey["update"];
}

export interface DBFactoryFQLUDFReplace {
  document: CRUDReferenceDocument["update"];
  database: CRUDReferenceDatabase["update"];
  collection: CRUDReferenceCollection["update"];
  index: CRUDReferenceIndex["update"];
  udfunction: CRUDReferenceUDFunction["update"];
  role: CRUDReferenceRole["update"];
  token: CRUDReferenceToken["update"];
  key: CRUDReferenceKey["update"];
}
export interface DBFactoryFQLUDFRepsert {
  document: CRUDReferenceDocument["update"];
  database: CRUDReferenceDatabase["update"];
  collection: CRUDReferenceCollection["update"];
  index: CRUDReferenceIndex["update"];
  udfunction: CRUDReferenceUDFunction["update"];
  role: CRUDReferenceRole["update"];
  token: CRUDReferenceToken["update"];
  key: CRUDReferenceKey["update"];
}

export interface DBFactoryFQLUDFDelete {
  document: CRUDReferenceDocument["delete"];
  database: CRUDReferenceDatabase["delete"];
  collection: CRUDReferenceCollection["delete"];
  index: CRUDReferenceIndex["delete"];
  udfunction: CRUDReferenceUDFunction["delete"];
  role: CRUDReferenceRole["delete"];
  token: CRUDReferenceToken["delete"];
  key: CRUDReferenceKey["delete"];
}

export interface DBFactoryFQLUDFForget {
  document: CRUDReferenceDocument["delete"];
  database: CRUDReferenceDatabase["delete"];
  collection: CRUDReferenceCollection["delete"];
  index: CRUDReferenceIndex["delete"];
  udfunction: CRUDReferenceUDFunction["delete"];
  role: CRUDReferenceRole["delete"];
  token: CRUDReferenceToken["delete"];
  key: CRUDReferenceKey["delete"];
}
