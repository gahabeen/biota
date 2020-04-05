import { query as q } from "faunadb";
import { get as getFQLUDF } from "~/factory/api/fql/udf/get";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";

export const GetUDFunctions = UDFunction({
  name: udfunctionNameNormalized("GetUDFunctions"),
  body: q.Query((identity) => getFQLUDF.udfunctions()),
});
