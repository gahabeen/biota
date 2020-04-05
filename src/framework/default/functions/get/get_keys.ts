import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { get as getFQLUDF } from "~/factory/api/fql/udf/get";

export const GetKeys = UDFunction({
  name: udfunctionNameNormalized("GetKeys"),
  body: q.Query((identity) => getFQLUDF.keys()),
});
