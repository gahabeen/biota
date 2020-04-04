import { query as q } from "faunadb";
import { get as getFQLUDF } from "~/factory/api/fql/udf/get";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";

export const GetUDFunction = UDFunction({
  name: udfunctionNameNormalized("GetUDFunction"),
  body: q.Query((userRef, name) => getFQLUDF.udfunction(name)),
});
