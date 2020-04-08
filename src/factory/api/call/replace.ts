import { query as q } from "faunadb";
import { DBFactoryCallReplace } from "~/../types/factory/factory.call";
import { Identity } from "~/factory/api/ql";
import { udfunctionNameNormalized as udfName } from "~/factory/classes/udfunction";
import { DB } from "~/db";

export const replace: DBFactoryCallReplace = {
  document(this: DB, collection, id, data) {
    return q.Call(udfName("ReplaceDocument"), Identity(), this.private_key, collection, id, data);
  },
  database(this: DB, name, options) {
    return q.Call(udfName("ReplaceDabase"), Identity(), this.private_key, name, options);
  },
  collection(this: DB, name, options) {
    return q.Call(udfName("ReplaceCollection"), Identity(), this.private_key, name, options);
  },
  index(this: DB, name, options) {
    return q.Call(udfName("ReplaceIndex"), Identity(), this.private_key, name, options);
  },
  udfunction(this: DB, name, options) {
    return q.Call(udfName("ReplaceFunction"), Identity(), this.private_key, name, options);
  },
  role(this: DB, name, options) {
    return q.Call(udfName("ReplaceRole"), Identity(), this.private_key, name, options);
  },
  token(this: DB, ref, options) {
    return q.Call(udfName("ReplaceToken"), Identity(), this.private_key, ref, options);
  },
  key(this: DB, options) {
    return q.Call(udfName("ReplaceKey"), Identity(), this.private_key, options);
  },
};
