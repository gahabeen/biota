import { query as q } from "faunadb";
import { DBFactoryCallUnAssign } from "~/../types/factory/factory.call";
import { Identity } from "~/factory/api/ql";
import { udfunctionNameNormalized as udfName } from "~/factory/classes/udfunction";
import { DB } from "~/db";

export const unassign: DBFactoryCallUnAssign = {
  document(this: DB, collection, id, oldAssignee) {
    return q.Call(udfName("UnAssignDocument"), Identity(), this.private_key, collection, id, oldAssignee);
  },
};
