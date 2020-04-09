import { query as q } from "faunadb";
import { DBFactoryCallUpdate } from "~/../types/factory/factory.call";
import { Identity } from "~/factory/api/ql";
import { udfunctionNameNormalized as udfName } from "~/factory/classes/udfunction";
import { DB } from "~/db";

export const update: DBFactoryCallUpdate = {
  credentials(this: DB, collection, id, credentials) {
    return q.Call(udfName("UpdateCredentials"), Identity(), this.private_key, collection, id, credentials);
  },
  document(this: DB, collection, id, data) {
    return q.Call(udfName("UpdateDocument"), Identity(), this.private_key, collection, id, data);
  },
  database(this: DB, name, options) {
    return q.Call(udfName("UpdateDabase"), Identity(), this.private_key, name, options);
  },
  collection(this: DB, name, options) {
    return q.Call(udfName("UpdateCollection"), Identity(), this.private_key, name, options);
  },
  index(this: DB, name, options) {
    return q.Call(udfName("UpdateIndex"), Identity(), this.private_key, name, options);
  },
  udfunction(this: DB, name, options) {
    return q.Call(udfName("UpdateUDFunction"), Identity(), this.private_key, name, options);
  },
  role(this: DB, name, options) {
    return q.Call(udfName("UpdateRole"), Identity(), this.private_key, name, options);
  },
  token(this: DB, ref, options) {
    return q.Call(udfName("UpdateToken"), Identity(), this.private_key, ref, options);
  },
  key(this: DB, options) {
    return q.Call(udfName("UpdateKey"), Identity(), this.private_key, options);
  },
};
