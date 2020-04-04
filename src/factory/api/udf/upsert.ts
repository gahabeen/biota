import { DBFactoryUDFUpsert } from "~/../types/factory/factory.udf";
import { query as q } from "faunadb";
import { Reference, Identity } from "~/factory/api/ql";

export const upsert: DBFactoryUDFUpsert = {
  document(collection, id, data) {
    return q.Call("biota.Upsert", [Identity(), Reference({ collection, id }), data]);
  },
  database(name, options) {
    return q.Call("biota.UpsertDabase", [Identity(), name, options]);
  },
  collection(name, options) {
    return q.Call("biota.UpsertCollection", [Identity(), name, options]);
  },
  index(name, options) {
    return q.Call("biota.UpsertIndex", [Identity(), name, options]);
  },
  udfunction(name, options) {
    return q.Call("biota.UpsertFunction", [Identity(), name, options]);
  },
  role(name, options) {
    return q.Call("biota.UpsertRole", [Identity(), name, options]);
  },
  token(ref, options) {
    return q.Call("biota.UpsertToken", [Identity(), ref, options]);
  },
  key(options) {
    return q.Call("biota.UpsertKey", [Identity(), options]);
  },
};
