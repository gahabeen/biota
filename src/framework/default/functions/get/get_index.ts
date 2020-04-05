import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { get as getFQLUDF } from "~/factory/api/fql/udf/get";

export const GetIndex = UDFunction({
  name: udfunctionNameNormalized("GetIndex"),
  body: q.Query((identity, name) => getFQLUDF.index(name)),
});