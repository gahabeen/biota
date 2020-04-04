import { DBFactoryUDFDelete } from "~/../types/factory/factory.udf";
import { query as q } from "faunadb";
import { Reference, Identity } from "~/factory/api/ql";

export const delete_: DBFactoryUDFDelete = {
  document(collection, id) {
    return q.Call("biota.Delete", [Identity(), Reference({ collection, id })]);
  },
  database(name) {
    return q.Call("biota.Delete", [Identity(), q.Database(name)]);
  },
  collection(name) {
    return q.Call("biota.Delete", [Identity(), q.Collection(name)]);
  },
  index(name) {
    return q.Call("biota.Delete", [Identity(), q.Index(name)]);
  },
  udfunction(name) {
    return q.Call("biota.Delete", [Identity(), q.Function(name)]);
  },
  role(name) {
    return q.Call("biota.Delete", [Identity(), q.Role(name)]);
  },
  token(id) {
    return q.Call("biota.Delete", [Identity(), q.Ref(q.Tokens(), id)]);
  },
  key(id) {
    return q.Call("biota.Delete", [Identity(), q.Ref(q.Keys(), id)]);
  },
};
