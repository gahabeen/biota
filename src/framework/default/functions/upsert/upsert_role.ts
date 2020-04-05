import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { upsert as upsertFQLUDF } from "~/factory/api/fql/udf/upsert";

export const UpsertRole = UDFunction({
  name: udfunctionNameNormalized("UpsertRole"),
  body: q.Query((identity, name, options) => upsertFQLUDF.role(name, options)),
});
