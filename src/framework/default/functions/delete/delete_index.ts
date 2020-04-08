import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { delete_ as deleteFQLUDF } from "~/factory/api/fql/udf/delete";

export const DeleteIndex = UDFunction({
  name: udfunctionNameNormalized("DeleteIndex"),
  body: q.Query((identity, private_key, name) => deleteFQLUDF.index(name)),
});
