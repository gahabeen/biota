import { query as q } from "faunadb";
import { DBFactoryUDFForget } from "~/../types/factory/factory.udf";
import { Identity } from "~/factory/api/ql";
import { udfunctionNameNormalized as udfName } from "~/factory/classes/udfunction";

export const forget: DBFactoryUDFForget = {
  document(collection, id) {
    return q.Call(udfName("ForgetDocument"), Identity(), collection, id);
  },
  database(name) {
    return q.Call(udfName("ForgetDatabase"), Identity(), name);
  },
  collection(name) {
    return q.Call(udfName("ForgetCollection"), Identity(), name);
  },
  index(name) {
    return q.Call(udfName("ForgetIndex"), Identity(), name);
  },
  udfunction(name) {
    return q.Call(udfName("ForgetUDFunction"), Identity(), name);
  },
  role(name) {
    return q.Call(udfName("ForgetRole"), Identity(), name);
  },
  token(id) {
    return q.Call(udfName("ForgetToken"), Identity(), id);
  },
  key(id) {
    return q.Call(udfName("ForgetKey"), Identity(), id);
  },
};
