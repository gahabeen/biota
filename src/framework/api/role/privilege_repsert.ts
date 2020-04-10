import { FaunaRolePrivilege } from "~/../types/fauna";
import { DB } from "~/db";
import { role } from "~/factory/api/classes/role";
import { execute } from "~/tasks";

export function privilegeRepsert(this: DB, roleName: string) {
  let self = this;

  return async function privilegeRepsertMethod(privilege: FaunaRolePrivilege = {}) {
    return execute(
      [
        {
          name: `Repsert role privilege for [${roleName}]`,
          task() {
            return self.query(role.privilege.repsert.call(self, roleName, privilege));
          },
        },
      ],
      {
        domain: "DB.role.privilege.repsert",
      }
    );
  };
}
