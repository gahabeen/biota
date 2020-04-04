import { DBFactoryUDFUpdate } from "~/../types/factory/factory.udf";
import { query as q } from "faunadb";
import { Reference, Identity } from "~/factory/api/ql";

export const update: DBFactoryUDFUpdate = {
  credentials(collection, id, credentials) {
    return q.Call("biota.Update", [Identity(), collection, id, credentials]);
  },
  document(collection, id, data) {
    return q.Call("biota.Update", [Identity(), collection, id, data]);
  },
  database(name, options) {
    return q.Call("biota.UpdateDabase", [Identity(), name, options]);
  },
  collection(name, options) {
    return q.Call("biota.UpdateCollection", [Identity(), name, options]);
  },
  index(name, options) {
    return q.Call("biota.UpdateIndex", [Identity(), name, options]);
  },
  udfunction(name, options) {
    return q.Call("biota.UpdateFunction", [Identity(), name, options]);
  },
  role(name, options) {
    return q.Call("biota.UpdateRole", [Identity(), name, options]);
  },
  token(ref, options) {
    return q.Call("biota.UpdateToken", [Identity(), ref, options]);
  },
  key(options) {
    return q.Call("biota.UpdateKey", [Identity(), options]);
  },
};
