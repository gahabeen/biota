import { query as q } from "faunadb";
import { DBFactoryUDFAssign } from "~/../types/factory/factory.udf";
import { Identity } from "~/factory/api/ql";
import { udfunctionNameNormalized as udfName } from "~/factory/classes/udfunction";

export const own: DBFactoryUDFAssign = {
  document(collection, id, newAssignee) {
    return q.Call(udfName("AssignDocument"), [Identity(), collection, id, newAssignee]);
  },
};
