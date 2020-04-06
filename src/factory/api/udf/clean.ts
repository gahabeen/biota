import { query as q } from "faunadb";
import { DBFactoryUDFClean } from "~/../types/factory/factory.udf";
import { Identity } from "~/factory/api/ql";
import { udfunctionNameNormalized as udfName } from "~/factory/classes/udfunction";

export const clean: DBFactoryUDFClean = {
  document(collection, id) {
    return q.Call(udfName("CleanDocument"), Identity(), collection, id);
  },
  documents(collection) {
    return q.Call(udfName("CleanDocuments"), Identity(), collection);
  },
  database(name) {
    return q.Call(udfName("CleanDatabase"), Identity(), name);
  },
  databases() {
    return q.Call(udfName("CleanDatabases"), Identity());
  },
  collection(name) {
    return q.Call(udfName("CleanCollection"), Identity(), name);
  },
  collections() {
    return q.Call(udfName("CleanCollections"), Identity());
  },
  index(name) {
    return q.Call(udfName("CleanIndex"), Identity(), name);
  },
  indexes() {
    return q.Call(udfName("CleanIndexes"), Identity());
  },
  udfunction(name) {
    return q.Call(udfName("CleanUDFunction"), Identity(), name);
  },
  udfunctions() {
    return q.Call(udfName("CleanUDFunctions"), Identity());
  },
  role(name) {
    return q.Call(udfName("CleanRole"), Identity(), name);
  },
  roles() {
    return q.Call(udfName("CleanRoles"), Identity());
  },
  token(id) {
    return q.Call(udfName("CleanToken"), Identity(), id);
  },
  tokens() {
    return q.Call(udfName("CleanTokens"), Identity());
  },
  key(id) {
    return q.Call(udfName("CleanKey"), Identity(), id);
  },
  keys() {
    return q.Call(udfName("CleanKeys"), Identity());
  },
};
