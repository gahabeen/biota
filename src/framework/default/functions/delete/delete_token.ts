import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { delete_ as deleteFQLUDF } from "~/factory/api/fql/udf/delete";

export const DeleteToken = UDFunction({
  name: udfunctionNameNormalized("DeleteToken"),
  body: q.Query((userRef, id) => deleteFQLUDF.token(id)),
});
