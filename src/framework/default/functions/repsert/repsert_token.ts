import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { repsert as repsertFQLUDF } from "~/factory/api/fql/udf/repsert";

export const RepsertToken = UDFunction({
  name: udfunctionNameNormalized("RepsertToken"),
  body: q.Query((userRef, id, options) => repsertFQLUDF.token(id, options)),
});
