import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { update as updateFQLUDF } from "~/factory/api/fql/udf/update";

export const UpdateCredentials = UDFunction({
  name: udfunctionNameNormalized("UpdateCredentials"),
  body: q.Query(
    q.Lambda(
      ["identity", "private_key", "collection", "id", "credentials"],
      updateFQLUDF.credentials(q.Var("collection") as any, q.Var("id") as any, q.Var("credentials") as any)
    )
  ),
});
