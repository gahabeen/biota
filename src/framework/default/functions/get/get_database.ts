import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { get as getFQLUDF } from "~/factory/api/fql/udf/get";

export const GetDatabase = UDFunction({
  name: udfunctionNameNormalized("GetDatabase"),
  body: q.Query((identity, private_key, name) => getFQLUDF.database(name)),
});
