import { DBFactoryUDFGet } from "~/../types/factory/factory.udf";
import { query as q } from "faunadb";
import { Reference, Identity } from "~/factory/api/ql";

export const get: DBFactoryUDFGet = {
  document(collection, id, options = {}) {
    return q.Call("biota.Get", [Identity(), Reference({ collection, id }), options]);
  },
  database(name) {
    return q.Call("biota.Get", [Identity(), q.Database(name)]);
  },
  collection(name) {
    return q.Call("biota.Get", [Identity(), q.Collection(name)]);
  },
  index(name) {
    return q.Call("biota.Get", [Identity(), q.Index(name)]);
  },
  udfunction(name) {
    return q.Call("biota.Get", [Identity(), q.Function(name)]);
  },
  role(name) {
    return q.Call("biota.Get", [Identity(), q.Role(name)]);
  },
  token(id) {
    return q.Call("biota.Get", [Identity(), q.Ref(q.Tokens(), id)]);
  },
  key(id) {
    return q.Call("biota.Get", [Identity(), q.Ref(q.Keys(), id)]);
  },
};
