import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { role } from "~/factory/api/classes";

export const RoleUpsertMembership = UDFunction({
  name: udfunctionNameNormalized("RoleUpsertMembership"),
  body: q.Query((identity, name, membership) => role.membership.upsert(name, membership)),
});
