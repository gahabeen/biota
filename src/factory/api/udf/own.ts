import { query as q } from "faunadb";
import { DBFactoryUDFOwn } from "~/../types/factory/factory.udf";
import { Identity } from "~/factory/api/ql";
import { udfunctionNameNormalized as udfName } from "~/factory/classes/udfunction";

export const own: DBFactoryUDFOwn = {
  document(collection, id, newOwner) {
    return q.Call(udfName("OwnDocument"), Identity(), collection, id, newOwner);
  },
};
