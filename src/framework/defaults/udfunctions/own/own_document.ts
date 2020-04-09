import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { own as ownFQLUDF } from "~/factory/api/fql/udf/own";

export const OwnDocument = UDFunction({
  name: udfunctionNameNormalized("OwnDocument"),
  body: q.Query(
    q.Lambda(
      ["identity", "private_key", "collection", "id", "newOwner"],
      ownFQLUDF.document(q.Var("collection") as any, q.Var("id") as any, q.Var("newOwner") as any)
    )
  ),
});
