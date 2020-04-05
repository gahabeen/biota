import { query as q } from "faunadb";
import { get as getFQLUDF } from "~/factory/api/fql/udf/get";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";

export const GetRole = UDFunction({
  name: udfunctionNameNormalized("GetRole"),
  body: q.Query((identity, name) => getFQLUDF.role(name)),
});
