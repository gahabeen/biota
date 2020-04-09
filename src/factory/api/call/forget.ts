import { query as q } from "faunadb";
import { DBFactoryCallForget } from "~/../types/factory/factory.call";
import { Identity } from "~/factory/api/ql";
import { udfunctionNameNormalized as udfName } from "~/factory/classes/udfunction";
import { DB } from "~/db";

export const forget: DBFactoryCallForget = {
  document(this: DB, collection, id) {
    return q.Call(udfName("ForgetDocument"), Identity(), this.private_key, collection, id);
  },
  database(this: DB, name) {
    return q.Call(udfName("ForgetDatabase"), Identity(), this.private_key, name);
  },
  collection(this: DB, name) {
    return q.Call(udfName("ForgetCollection"), Identity(), this.private_key, name);
  },
  index(this: DB, name) {
    return q.Call(udfName("ForgetIndex"), Identity(), this.private_key, name);
  },
  udfunction(this: DB, name) {
    return q.Call(udfName("ForgetUDFunction"), Identity(), this.private_key, name);
  },
  role(this: DB, name) {
    return q.Call(udfName("ForgetRole"), Identity(), this.private_key, name);
  },
  token(this: DB, id) {
    return q.Call(udfName("ForgetToken"), Identity(), this.private_key, id);
  },
  key(this: DB, id) {
    return q.Call(udfName("ForgetKey"), Identity(), this.private_key, id);
  },
};
