import { query as q } from "faunadb";
import { DBFactoryCallRepsert } from "~/../types/factory/factory.call";
import { Identity } from "~/factory/api/ql";
import { udfunctionNameNormalized as udfName } from "~/factory/classes/udfunction";
import { DB } from "~/db";

export const repsert: DBFactoryCallRepsert = {
  document(this: DB, collection, id, data) {
    return q.Call(udfName("RepsertDocument"), Identity(), this.private_key, collection, id, data);
  },
  database(this: DB, name, options) {
    return q.Call(udfName("RepsertDabase"), Identity(), this.private_key, name, options);
  },
  collection(this: DB, name, options) {
    return q.Call(udfName("RepsertCollection"), Identity(), this.private_key, name, options);
  },
  index(this: DB, name, options) {
    return q.Call(udfName("RepsertIndex"), Identity(), this.private_key, name, options);
  },
  udfunction(this: DB, name, options) {
    return q.Call(udfName("RepsertFunction"), Identity(), this.private_key, name, options);
  },
  role(this: DB, name, options) {
    return q.Call(udfName("RepsertRole"), Identity(), this.private_key, name, options);
  },
  token(this: DB, ref, options) {
    return q.Call(udfName("RepsertToken"), Identity(), this.private_key, ref, options);
  },
  key(this: DB, options) {
    return q.Call(udfName("RepsertKey"), Identity(), this.private_key, options);
  },
};
