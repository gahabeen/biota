import { DBFactoryUDFGet } from "~/../types/factory/factory.udf";
import { query as q } from "faunadb";
import { Identity } from "~/factory/api/ql";
import { udfunctionNameNormalized as udfName } from "~/factory/classes/udfunction";

export const get: DBFactoryUDFGet = {
  document(collection, id, options = {}) {
    return q.Call(udfName("GetDocument"), [Identity(), collection, id, options]);
  },
  database(name) {
    return q.Call(udfName("GetDatabase"), [Identity(), name]);
  },
  collection(name) {
    return q.Call(udfName("GetCollection"), [Identity(), name]);
  },
  index(name) {
    return q.Call(udfName("GetIndex"), [Identity(), name]);
  },
  udfunction(name) {
    return q.Call(udfName("GetUDFunction"), [Identity(), name]);
  },
  role(name) {
    return q.Call(udfName("GetRole"), [Identity(), name]);
  },
  token(id) {
    return q.Call(udfName("GetToken"), [Identity(), id]);
  },
  key(id) {
    return q.Call(udfName("GetKey"), [Identity(), id]);
  },
};
