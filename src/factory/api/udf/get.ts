import { query as q } from "faunadb";
import { DBFactoryUDFGet } from "~/../types/factory/factory.udf";
import { Identity } from "~/factory/api/ql";
import { udfunctionNameNormalized as udfName } from "~/factory/classes/udfunction";

export const get: DBFactoryUDFGet = {
  document(collection, id, options = {}) {
    return q.Call(udfName("GetDocument"), Identity(), collection, id, options);
  },
  database(name) {
    return q.Call(udfName("GetDatabase"), Identity(), name);
  },
  databases(pagination) {
    return q.Call(udfName("GetDatabases"), Identity(), pagination);
  },
  collection(name) {
    return q.Call(udfName("GetCollection"), Identity(), name);
  },
  collections(pagination) {
    return q.Call(udfName("GetCollections"), Identity(), pagination);
  },
  index(name) {
    return q.Call(udfName("GetIndex"), Identity(), name);
  },
  indexes(pagination) {
    return q.Call(udfName("GetIndexes"), Identity(), pagination);
  },
  udfunction(name) {
    return q.Call(udfName("GetUDFunction"), Identity(), name);
  },
  udfunctions(pagination) {
    return q.Call(udfName("GetUDFunctions"), Identity(), pagination);
  },
  role(name) {
    return q.Call(udfName("GetRole"), Identity(), name);
  },
  roles(pagination) {
    return q.Call(udfName("GetRoles"), Identity(), pagination);
  },
  token(id) {
    return q.Call(udfName("GetToken"), Identity(), id);
  },
  tokens(pagination) {
    return q.Call(udfName("GetTokens"), Identity(), pagination);
  },
  key(id) {
    return q.Call(udfName("GetKey"), Identity(), id);
  },
  keys(pagination) {
    return q.Call(udfName("GetKeys"), Identity(), pagination);
  },
  credentials(pagination) {
    return q.Call(udfName("GetCredentials"), Identity(), pagination);
  },
};
