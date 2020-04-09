import { query as q } from "faunadb";
import { DBFactoryCallDelete } from "~/../types/factory/factory.call";
import { Identity } from "~/factory/api/ql";
import { udfunctionNameNormalized as udfName } from "~/factory/classes/udfunction";
import { DB } from "~/db";

export const delete_: DBFactoryCallDelete = {
  document(this: DB, collection, id) {
    return q.Call(udfName("DeleteDocument"), Identity(), this.private_key, collection, id);
  },
  database(this: DB, name) {
    return q.Call(udfName("DeleteDatabase"), Identity(), this.private_key, q.Database(name));
  },
  collection(this: DB, name) {
    return q.Call(udfName("DeleteCollection"), Identity(), this.private_key, q.Collection(name));
  },
  index(this: DB, name) {
    return q.Call(udfName("DeleteIndex"), Identity(), this.private_key, q.Index(name));
  },
  udfunction(this: DB, name) {
    return q.Call(udfName("DeleteUDFunction"), Identity(), this.private_key, q.Function(name));
  },
  role(this: DB, name) {
    return q.Call(udfName("DeleteRole"), Identity(), this.private_key, q.Role(name));
  },
  token(this: DB, id) {
    return q.Call(udfName("DeleteToken"), Identity(), this.private_key, q.Ref(q.Tokens(), id));
  },
  key(this: DB, id) {
    return q.Call(udfName("DeleteKey"), Identity(), this.private_key, q.Ref(q.Keys(), id));
  },
};
