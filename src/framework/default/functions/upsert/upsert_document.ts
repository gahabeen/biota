import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { upsert as upsertFQLUDF } from "~/factory/api/fql/udf/upsert";

export const UpsertDocument = UDFunction({
  name: udfunctionNameNormalized("UpsertDocument"),
  body: q.Query((identity, private_key, collection, id, data) => upsertFQLUDF.document(q.Var("collection") as any, q.Var("id") as any, q.Var("data") as any)),
});
