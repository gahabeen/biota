import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { repsert as repsertFQLUDF } from "~/factory/api/fql/udf/repsert";

export const RepsertDocument = UDFunction({
  name: udfunctionNameNormalized("RepsertDocument"),
  body: q.Query(
    q.Lambda(
      ["identity", "private_key", "collection", "id", "data"],
      repsertFQLUDF.document(q.Var("collection") as any, q.Var("id") as any, q.Var("data") as any)
    )
  ),
});
