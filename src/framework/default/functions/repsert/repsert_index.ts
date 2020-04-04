import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { repsert as repsertFQLUDF } from "~/factory/api/fql/udf/repsert";

export const RepsertIndex = UDFunction({
  name: udfunctionNameNormalized("RepsertIndex"),
  body: q.Query((userRef, name, options) => repsertFQLUDF.index(name, options)),
});
