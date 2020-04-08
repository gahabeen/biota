import { DB } from "~/db";
import { FaunaCollectionOptions, FaunaId, FaunaRoleMembership } from "~/../types/fauna";
import { role } from "~/factory/api/classes/role";
import { execute } from "~/tasks";

export function membershipUpsert(this: DB, roleName: string) {
  let self = this;

  return async function membershipUpsertMethod(membership: FaunaRoleMembership = {}) {
    return execute(
      [
        {
          name: `Upsert role membership [${roleName}] on [${membership.resource}]`,
          task() {
            return self.query(role.membership.upsert.call(self, roleName, membership));
          },
        },
      ],
      {
        domain: "DB.role.membership.upsert",
      }
    );
  };
}
