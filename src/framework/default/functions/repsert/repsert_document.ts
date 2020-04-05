import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { repsert as repsertFQLUDF } from "~/factory/api/fql/udf/repsert";

export const RepsertDocument = UDFunction({
  name: udfunctionNameNormalized("RepsertDocument"),
  body: q.Query((identity, collection, id, options) => repsertFQLUDF.document(collection, id, options)),
});