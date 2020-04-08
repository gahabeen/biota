import { query as q } from "faunadb";
import { get as getFQLUDF } from "~/factory/api/fql/udf/get";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";

export const GetToken = UDFunction({
  name: udfunctionNameNormalized("GetToken"),
  body: q.Query((identity, private_key, id) => getFQLUDF.token(id)),
});
