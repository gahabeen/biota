import { query as q } from "faunadb";
import { DBFactoryUDFUnAssign } from "~/../types/factory/factory.udf";
import { Identity } from "~/factory/api/ql";
import { udfunctionNameNormalized as udfName } from "~/factory/classes/udfunction";

export const unassign: DBFactoryUDFUnAssign = {
  document(collection, id, oldAssignee) {
    return q.Call(udfName("UnAssignDocument"), Identity(), collection, id, oldAssignee);
  },
};
