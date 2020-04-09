import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { get as getFQLUDF } from "~/factory/api/fql/udf/get";

export const GetIndexes = UDFunction({
  name: udfunctionNameNormalized("GetIndexes"),
  body: q.Query(q.Lambda(["identity"], getFQLUDF.indexes())),
});
