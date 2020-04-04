import { query as q } from "faunadb";
import { DBFactoryUDFUpsert } from "~/../types/factory/factory.udf";
import { Identity } from "~/factory/api/ql";
import { udfunctionNameNormalized as udfName } from "~/factory/classes/udfunction";

export const upsert: DBFactoryUDFUpsert = {
  document(collection, id, data) {
    return q.Call(udfName("UpsertDocument"), [Identity(), collection, id, data]);
  },
  database(name, options) {
    return q.Call(udfName("UpsertDabase"), [Identity(), name, options]);
  },
  collection(name, options) {
    return q.Call(udfName("UpsertCollection"), [Identity(), name, options]);
  },
  index(name, options) {
    return q.Call(udfName("UpsertIndex"), [Identity(), name, options]);
  },
  udfunction(name, options) {
    return q.Call(udfName("UpsertFunction"), [Identity(), name, options]);
  },
  role(name, options) {
    return q.Call(udfName("UpsertRole"), [Identity(), name, options]);
  },
  token(ref, options) {
    return q.Call(udfName("UpsertToken"), [Identity(), ref, options]);
  },
  key(options) {
    return q.Call(udfName("UpsertKey"), [Identity(), options]);
  },
};
