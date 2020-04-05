import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { repsert as repsertFQLUDF } from "~/factory/api/fql/udf/repsert";

export const RepsertRole = UDFunction({
  name: udfunctionNameNormalized("RepsertRole"),
  body: q.Query((identity, name, options) => repsertFQLUDF.role(name, options)),
});
