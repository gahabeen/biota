import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { get as getFQLUDF } from "~/factory/api/fql/udf/get";

export const GetCollection = UDFunction({
  name: udfunctionNameNormalized("GetCollection"),
  body: q.Query((userRef, name) => getFQLUDF.collection(name)),
});
