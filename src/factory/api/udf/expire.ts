import { query as q } from "faunadb";
import { DBFactoryUDFExpire } from "~/../types/factory/factory.udf";
import { Identity } from "~/factory/api/ql";
import { udfunctionNameNormalized as udfName } from "~/factory/classes/udfunction";

export const expire: DBFactoryUDFExpire = {
  document(collection, id, at) {
    return q.Call(udfName("ExpireDocument"), Identity(), collection, id, at);
  },
};
