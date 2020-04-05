import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { update as updateFQLUDF } from "~/factory/api/fql/udf/update";

export const UpdateCredentials = UDFunction({
  name: udfunctionNameNormalized("UpdateCredentials"),
  body: q.Query(q.Lambda((identity, collection, id, credentials) => updateFQLUDF.credentials(collection, id, credentials))),
});
