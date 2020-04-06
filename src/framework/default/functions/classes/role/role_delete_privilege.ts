import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { role } from "~/factory/api/classes";

export const RoleDeletePrivilege = UDFunction({
  name: udfunctionNameNormalized("RoleDeletePrivilege"),
  body: q.Query((identity, name, resource) => role.privilege.delete(name, resource)),
});
