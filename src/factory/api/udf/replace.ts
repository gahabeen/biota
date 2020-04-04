import { query as q } from "faunadb";
import { DBFactoryUDFReplace } from "~/../types/factory/factory.udf";
import { Identity } from "~/factory/api/ql";
import { udfunctionNameNormalized as udfName } from "~/factory/classes/udfunction";

export const replace: DBFactoryUDFReplace = {
  document(collection, id, data) {
    return q.Call(udfName("Replace"), [Identity(), collection, id, data]);
  },
  database(name, options) {
    return q.Call(udfName("ReplaceDabase"), [Identity(), name, options]);
  },
  collection(name, options) {
    return q.Call(udfName("ReplaceCollection"), [Identity(), name, options]);
  },
  index(name, options) {
    return q.Call(udfName("ReplaceIndex"), [Identity(), name, options]);
  },
  udfunction(name, options) {
    return q.Call(udfName("ReplaceFunction"), [Identity(), name, options]);
  },
  role(name, options) {
    return q.Call(udfName("ReplaceRole"), [Identity(), name, options]);
  },
  token(ref, options) {
    return q.Call(udfName("ReplaceToken"), [Identity(), ref, options]);
  },
  key(options) {
    return q.Call(udfName("ReplaceKey"), [Identity(), options]);
  },
};
