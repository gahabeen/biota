import { DBFactoryUDFReplace } from "~/../types/factory/factory.udf";
import { query as q } from "faunadb";
import { Reference, Identity } from "~/factory/api/ql";

export const replace: DBFactoryUDFReplace = {
  document(collection, id, data) {
    return q.Call("biota.Replace", [Identity(), Reference({ collection, id }), data]);
  },
  database(name, options) {
    return q.Call("biota.ReplaceDabase", [Identity(), name, options]);
  },
  collection(name, options) {
    return q.Call("biota.ReplaceCollection", [Identity(), name, options]);
  },
  index(name, options) {
    return q.Call("biota.ReplaceIndex", [Identity(), name, options]);
  },
  udfunction(name, options) {
    return q.Call("biota.ReplaceFunction", [Identity(), name, options]);
  },
  role(name, options) {
    return q.Call("biota.ReplaceRole", [Identity(), name, options]);
  },
  token(ref, options) {
    return q.Call("biota.ReplaceToken", [Identity(), ref, options]);
  },
  key(options) {
    return q.Call("biota.ReplaceKey", [Identity(), options]);
  },
};
