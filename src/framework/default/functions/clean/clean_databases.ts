import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { clean as cleanFQLUDF } from "~/factory/api/fql/udf/clean";

export const CleanDatabases = UDFunction({
  name: udfunctionNameNormalized("CleanDatabases"),
  body: q.Query((identity) => cleanFQLUDF.databases()),
});
