import { query as q } from "faunadb";
import { DBFactoryUDFDelete } from "~/../types/factory/factory.udf";
import { Identity } from "~/factory/api/ql";
import { udfunctionNameNormalized as udfName } from "~/factory/classes/udfunction";

export const delete_: DBFactoryUDFDelete = {
  document(collection, id) {
    return q.Call(udfName("DeleteDocument"), [Identity(), collection, id]);
  },
  database(name) {
    return q.Call(udfName("DeleteDatabase"), [Identity(), q.Database(name)]);
  },
  collection(name) {
    return q.Call(udfName("DeleteCollection"), [Identity(), q.Collection(name)]);
  },
  index(name) {
    return q.Call(udfName("DeleteIndex"), [Identity(), q.Index(name)]);
  },
  udfunction(name) {
    return q.Call(udfName("DeleteUDFunction"), [Identity(), q.Function(name)]);
  },
  role(name) {
    return q.Call(udfName("DeleteRole"), [Identity(), q.Role(name)]);
  },
  token(id) {
    return q.Call(udfName("DeleteToken"), [Identity(), q.Ref(q.Tokens(), id)]);
  },
  key(id) {
    return q.Call(udfName("DeleteKey"), [Identity(), q.Ref(q.Keys(), id)]);
  },
};
