import { query as q } from "faunadb";
import { DBFactoryUDFInsert } from "~/../types/factory/factory.udf";
import { Identity } from "~/factory/api/ql";
import { udfunctionNameNormalized as udfName } from "~/factory/classes/udfunction";
import { nameOrOptions } from "~/helpers";

export const insert: DBFactoryUDFInsert = {
  document(collection, data, id = null) {
    return q.Call(udfName("InsertDocument"), Identity(), collection, data, id);
  },
  database(name, options) {
    let definition = nameOrOptions(name, options);
    return q.Call(udfName("InsertDatabase"), Identity(), definition);
  },
  collection(name, options) {
    let definition = nameOrOptions(name, options);
    return q.Call(udfName("InsertCollection"), Identity(), definition);
  },
  index(name, options) {
    let definition = nameOrOptions(name, options);
    return q.Call(udfName("InsertIndex"), Identity(), definition);
  },
  udfunction(name, options) {
    let definition = nameOrOptions(name, options);
    return q.Call(udfName("InsertFunction"), Identity(), definition);
  },
  role(name, options) {
    let definition = nameOrOptions(name, options);
    return q.Call(udfName("InsertRole"), Identity(), definition);
  },
  token(ref, options) {
    return q.Call(udfName("InsertToken"), Identity(), ref, options);
  },
  key(options) {
    return q.Call(udfName("InsertToken"), Identity(), options);
  },
};
