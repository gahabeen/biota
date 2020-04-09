import { query as q } from "faunadb";
import { DBFactoryCallAssign } from "~/../types/factory/factory.call";
import { Identity } from "~/factory/api/ql";
import { udfunctionNameNormalized as udfName } from "~/factory/classes/udfunction";
import { DB } from "~/db";

export const assign: DBFactoryCallAssign = {
  document(this: DB, collection, id, newAssignee) {
    return q.Call(udfName("AssignDocument"), Identity(), this.private_key, collection, id, newAssignee);
  },
};
