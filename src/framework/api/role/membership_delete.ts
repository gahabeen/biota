import { DB } from "~/db";
import { FaunaCollectionOptions, FaunaId, FaunaRoleMembership, FaunaRef } from "~/../types/fauna";
import { role } from "~/factory/api/classes/role";
import { execute } from "~/tasks";

export function membershipDelete(this: DB, roleName: string) {
  let self = this;

  return async function membershipDeleteMethod(resource: FaunaRef) {
    return execute(
      [
        {
          name: `Delete role membership [${roleName}] on [${resource}]`,
          task() {
            return self.query(role.membership.delete.call(self, roleName, resource));
          },
        },
      ],
      {
        domain: "DB.role.membership.delete",
      }
    );
  };
}
