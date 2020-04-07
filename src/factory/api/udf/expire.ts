import { query as q } from "faunadb";
import { DBFactoryUDFExpire } from "~/../types/factory/factory.udf";
import { Identity } from "~/factory/api/ql";
import { udfunctionNameNormalized as udfName } from "~/factory/classes/udfunction";

export const expire: DBFactoryUDFExpire = {
  documentAt(collection, id, at) {
    return q.Call(udfName("ExpireDocumentAt"), Identity(), collection, id, at);
  },
  documentIn(collection, id, delayInMs) {
    return q.Call(udfName("ExpireDocumentIn"), Identity(), collection, id, delayInMs);
  },
  documentNow(collection, id) {
    return q.Call(udfName("ExpireDocumentNow"), Identity(), collection, id);
  },
};
