import { FaunaRolePrivilege } from "~/../types/fauna";
import { DB } from "~/db";
import { role } from "~/factory/api/classes/role";
import { execute } from "~/tasks";

export function privilegeUpsert(this: DB, roleName: string) {
  let self = this;

  return async function privilegeUpsertMethod(privilege: FaunaRolePrivilege = {}) {
    return execute(
      [
        {
          name: `Upsert role privilege [${roleName}] on [${privilege.resource}]`,
          task() {
            return self.query(role.privilege.upsert.call(self, roleName, privilege));
          },
        },
      ],
      {
        domain: "DB.role.privilege.upsert",
      }
    );
  };
}
