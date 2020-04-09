import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { get as getFQLUDF } from "~/factory/api/fql/udf/get";

export const GetDocument = UDFunction({
  name: udfunctionNameNormalized("GetDocument"),
  body: q.Query(
    q.Lambda(["identity", "private_key", "collection", "id"], getFQLUDF.document(q.Var("collection") as any, q.Var("id") as any))
  ),
});
