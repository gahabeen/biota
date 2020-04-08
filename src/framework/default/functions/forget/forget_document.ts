import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { forget as forgetFQLUDF } from "~/factory/api/fql/udf/forget";

export const ForgetDocument = UDFunction({
  name: udfunctionNameNormalized("ForgetDocument"),
  body: q.Query((identity, private_key, collection, id) => forgetFQLUDF.document(collection, id)),
});
