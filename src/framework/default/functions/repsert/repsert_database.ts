import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { repsert as repsertFQLUDF } from "~/factory/api/fql/udf/repsert";

export const RepsertDatabase = UDFunction({
  name: udfunctionNameNormalized("RepsertDatabase"),
  body: q.Query((userRef, name, options) => repsertFQLUDF.database(name, options)),
});
