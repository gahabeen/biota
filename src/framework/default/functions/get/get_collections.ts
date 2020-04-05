import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { get as getFQLUDF } from "~/factory/api/fql/udf/get";

export const GetCollections = UDFunction({
  name: udfunctionNameNormalized("GetCollections"),
  body: q.Query((identity) => getFQLUDF.collections()),
});
