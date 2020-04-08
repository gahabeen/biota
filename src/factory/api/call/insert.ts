import { query as q } from "faunadb";
import { DBFactoryCallInsert } from "~/../types/factory/factory.call";
import { DB } from "~/db";
import { Identity } from "~/factory/api/ql";
import { udfunctionNameNormalized as udfName } from "~/factory/classes/udfunction";

export const insert: DBFactoryCallInsert = {
  document(this: DB, collection, data, id = null) {
    return q.Call(udfName("InsertDocument"), Identity(), this.private_key, collection, data, id);
  },
  database(this: DB, name, options) {
    return q.Call(udfName("InsertDatabase"), Identity(), this.private_key, name, options);
  },
  collection(this: DB, name, options) {
    return q.Call(udfName("InsertCollection"), Identity(), this.private_key, name, options);
  },
  index(this: DB, name, options) {
    return q.Call(udfName("InsertIndex"), Identity(), this.private_key, name, options);
  },
  udfunction(this: DB, name, options) {
    return q.Call(udfName("InsertUDFunction"), Identity(), this.private_key, name, options);
  },
  role(this: DB, name, options) {
    return q.Call(udfName("InsertRole"), Identity(), this.private_key, name, options);
  },
  token(this: DB, ref, options) {
    return q.Call(udfName("InsertToken"), Identity(), this.private_key, ref, options);
  },
  key(this: DB, options) {
    return q.Call(udfName("InsertToken"), Identity(), this.private_key, options);
  },
};
