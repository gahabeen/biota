import { query as q } from "faunadb";
import { DBFactoryUDFUpdate } from "~/../types/factory/factory.udf";
import { Identity } from "~/factory/api/ql";
import { udfunctionNameNormalized as udfName } from "~/factory/classes/udfunction";

export const update: DBFactoryUDFUpdate = {
  credentials(collection, id, credentials) {
    return q.Call(udfName("UpdateDocument"), Identity(), collection, id, credentials);
  },
  document(collection, id, data) {
    return q.Call(udfName("UpdateDocument"), Identity(), collection, id, data);
  },
  database(name, options) {
    return q.Call(udfName("UpdateDabase"), Identity(), name, options);
  },
  collection(name, options) {
    return q.Call(udfName("UpdateCollection"), Identity(), name, options);
  },
  index(name, options) {
    return q.Call(udfName("UpdateIndex"), Identity(), name, options);
  },
  udfunction(name, options) {
    return q.Call(udfName("UpdateFunction"), Identity(), name, options);
  },
  role(name, options) {
    return q.Call(udfName("UpdateRole"), Identity(), name, options);
  },
  token(ref, options) {
    return q.Call(udfName("UpdateToken"), Identity(), ref, options);
  },
  key(options) {
    return q.Call(udfName("UpdateKey"), Identity(), options);
  },
};
