import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { unassign as unassignFQLUDF } from "~/factory/api/fql/udf/unassign";

export const UnAssignDocument = UDFunction({
  name: udfunctionNameNormalized("UnAssignDocument"),
  body: q.Query((identity, private_key, collection, id, oldAssignee) => unassignFQLUDF.document(q.Var("collection") as any, q.Var("id") as any, q.Var("oldAssignee") as any)),
});
