import { query as q } from "faunadb";
import { Reference, Identity } from "~/factory/api/ql";
import { DBFactoryUDFInsert } from "~/../types/factory/factory.udf";
import { nameOrOptions } from "~/helpers";

export const insert: DBFactoryUDFInsert = {
  document(collection, options = {}, id) {
    return q.Call("biota.Insert", [Identity(), Reference({ collection, id }), options]);
  },
  database(name, options) {
    let definition = nameOrOptions(name, options);
    return q.Call("biota.InsertDatabase", [Identity(), definition]);
  },
  collection(name, options) {
    let definition = nameOrOptions(name, options);
    return q.Call("biota.InsertCollection", [Identity(), definition]);
  },
  index(name, options) {
    let definition = nameOrOptions(name, options);
    return q.Call("biota.InsertIndex", [Identity(), definition]);
  },
  udfunction(name, options) {
    let definition = nameOrOptions(name, options);
    return q.Call("biota.InsertFunction", [Identity(), definition]);
  },
  role(name, options) {
    let definition = nameOrOptions(name, options);
    return q.Call("biota.InsertRole", [Identity(), definition]);
  },
  token(ref, options) {
    return q.Call("biota.InsertToken", [Identity(), ref, options]);
  },
  key(options) {
    return q.Call("biota.InsertToken", [Identity(), options]);
  },
};
