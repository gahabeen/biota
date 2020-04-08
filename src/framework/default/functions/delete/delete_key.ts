import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { delete_ as deleteFQLUDF } from "~/factory/api/fql/udf/delete";

export const DeleteKey = UDFunction({
  name: udfunctionNameNormalized("DeleteKey"),
  body: q.Query((identity, private_key, id) => deleteFQLUDF.key(q.Var("id") as any)),
});
