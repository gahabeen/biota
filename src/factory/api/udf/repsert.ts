import { query as q } from "faunadb";
import { DBFactoryUDFRepsert } from "~/../types/factory/factory.udf";
import { Identity } from "~/factory/api/ql";
import { udfunctionNameNormalized as udfName } from "~/factory/classes/udfunction";

export const repsert: DBFactoryUDFRepsert = {
  document(collection, id, data) {
    return q.Call(udfName("RepsertDocument"), Identity(), collection, id, data);
  },
  database(name, options) {
    return q.Call(udfName("RepsertDabase"), Identity(), name, options);
  },
  collection(name, options) {
    return q.Call(udfName("RepsertCollection"), Identity(), name, options);
  },
  index(name, options) {
    return q.Call(udfName("RepsertIndex"), Identity(), name, options);
  },
  udfunction(name, options) {
    return q.Call(udfName("RepsertFunction"), Identity(), name, options);
  },
  role(name, options) {
    return q.Call(udfName("RepsertRole"), Identity(), name, options);
  },
  token(ref, options) {
    return q.Call(udfName("RepsertToken"), Identity(), ref, options);
  },
  key(options) {
    return q.Call(udfName("RepsertKey"), Identity(), options);
  },
};
