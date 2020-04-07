import { FaunaRoleOptions } from "~/../types/fauna";
import { DB } from "~/db";
import { role } from "~/factory/api/classes/role";
import { execute } from "~/tasks";

export function update(this: DB, roleName: string) {
  let self = this;

  return async function updateMethod(options: FaunaRoleOptions = {}) {
    return execute(
      [
        {
          name: `Update role [${roleName}]`,
          task() {
            return self.query(role.update(roleName, options));
          },
        },
      ],
      {
        domain: "DB.role.update",
      }
    );
  };
}
