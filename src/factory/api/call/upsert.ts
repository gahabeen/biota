import { query as q } from "faunadb";
import { DBFactoryCallUpsert } from "~/../types/factory/factory.call";
import { Identity } from "~/factory/api/ql";
import { udfunctionNameNormalized as udfName } from "~/factory/classes/udfunction";
import { DB } from "~/db";

export const upsert: DBFactoryCallUpsert = {
  document(this: DB, collection, id, data) {
    return q.Call(udfName("UpsertDocument"), Identity(), this.private_key, collection, id, data);
  },
  database(this: DB, name, options) {
    return q.Call(udfName("UpsertDabase"), Identity(), this.private_key, name, options);
  },
  collection(this: DB, name, options) {
    return q.Call(udfName("UpsertCollection"), Identity(), this.private_key, name, options);
  },
  index(this: DB, name, options) {
    return q.Call(udfName("UpsertIndex"), Identity(), this.private_key, name, options);
  },
  udfunction(this: DB, name, options) {
    return q.Call(udfName("UpsertFunction"), Identity(), this.private_key, name, options);
  },
  role(this: DB, name, options) {
    return q.Call(udfName("UpsertRole"), Identity(), this.private_key, name, options);
  },
  token(this: DB, ref, options) {
    return q.Call(udfName("UpsertToken"), Identity(), this.private_key, ref, options);
  },
  key(this: DB, options) {
    return q.Call(udfName("UpsertKey"), Identity(), this.private_key, options);
  },
};
