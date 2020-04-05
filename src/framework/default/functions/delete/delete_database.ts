import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { delete_ as deleteFQLUDF } from "~/factory/api/fql/udf/delete";

export const DeleteDatabase = UDFunction({
  name: udfunctionNameNormalized("DeleteDatabase"),
  body: q.Query((identity, name) => deleteFQLUDF.database(name)),
});
