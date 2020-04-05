import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { delete_ as deleteFQLUDF } from "~/factory/api/fql/udf/delete";

export const DeleteCollection = UDFunction({
  name: udfunctionNameNormalized("DeleteCollection"),
  body: q.Query((identity, name) => deleteFQLUDF.collection(name)),
});
