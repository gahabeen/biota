import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { role } from "~/factory/api/classes";

export const RoleUpsertPrivilege = UDFunction({
  name: udfunctionNameNormalized("RoleUpsertPrivilege"),
  body: q.Query((identity, private_key, name, privilege) => role.privilege.upsert(name, privilege)),
});
