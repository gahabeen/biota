import { query as q } from "faunadb";
import { get as getFQLUDF } from "~/factory/api/fql/udf/get";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";

export const GetTokens = UDFunction({
  name: udfunctionNameNormalized("GetTokens"),
  body: q.Query((userRef) => getFQLUDF.tokens()),
});
