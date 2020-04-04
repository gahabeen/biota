import { DBFactoryUDFRepsert } from "~/../types/factory/factory.udf";
import { query as q } from "faunadb";
import { Reference, Identity } from "~/factory/api/ql";

export const repsert: DBFactoryUDFRepsert = {
  document(collection, id, data) {
    return q.Call("biota.Repsert", [Identity(), Reference({ collection, id }), data]);
  },
  database(name, options) {
    return q.Call("biota.RepsertDabase", [Identity(), name, options]);
  },
  collection(name, options) {
    return q.Call("biota.RepsertCollection", [Identity(), name, options]);
  },
  index(name, options) {
    return q.Call("biota.RepsertIndex", [Identity(), name, options]);
  },
  udfunction(name, options) {
    return q.Call("biota.RepsertFunction", [Identity(), name, options]);
  },
  role(name, options) {
    return q.Call("biota.RepsertRole", [Identity(), name, options]);
  },
  token(ref, options) {
    return q.Call("biota.RepsertToken", [Identity(), ref, options]);
  },
  key(options) {
    return q.Call("biota.RepsertKey", [Identity(), options]);
  },
};
