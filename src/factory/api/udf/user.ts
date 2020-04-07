import { query as q } from "faunadb";
import { DBFactoryUDFUser } from "~/../types/factory/factory.udf";
import { Identity } from "~/factory/api/ql";
import { udfunctionNameNormalized as udfName } from "~/factory/classes/udfunction";

export const user: DBFactoryUDFUser = {
  login(email, password) {
    return q.Call(udfName("UserLogin"), Identity(), email, password);
  },
  register(email, password, data = {}) {
    return q.Call(udfName("UserRegister"), Identity(), email, password, data);
  },
  changePassword(newPassword) {
    return q.Call(udfName("UserChangePassword"), Identity(), newPassword);
  },
};
