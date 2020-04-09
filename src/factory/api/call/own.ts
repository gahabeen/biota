import { query as q } from "faunadb";
import { DBFactoryCallOwn } from "~/../types/factory/factory.call";
import { Identity } from "~/factory/api/ql";
import { udfunctionNameNormalized as udfName } from "~/factory/classes/udfunction";
import { DB } from "~/db";

export const own: DBFactoryCallOwn = {
  document(this: DB, collection, id, newOwner) {
    return q.Call(udfName("OwnDocument"), Identity(), this.private_key, collection, id, newOwner);
  },
};
