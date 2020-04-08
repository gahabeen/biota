import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { own as ownFQLUDF } from "~/factory/api/fql/udf/own";

export const OwnDocument = UDFunction({
  name: udfunctionNameNormalized("OwnDocument"),
  body: q.Query((identity, private_key, collection, id, newOwner) => ownFQLUDF.document(collection, id, newOwner)),
});
