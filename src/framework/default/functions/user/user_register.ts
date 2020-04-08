import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { roleNameNormalized } from "~/factory/classes/role";
import { user as userFQLUDF } from "~/factory/api/fql/udf/user";

export const UserRegister = UDFunction({
  name: udfunctionNameNormalized("UserRegister"),
  body: q.Query((identity, private_key, email, password, data) =>
    userFQLUDF.register(q.Var("email") as string, q.Var("password") as string, q.Var("data"))
  ),
});
