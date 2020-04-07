import { FaunaRoleOptions } from "~/../types/fauna";
import { DB } from "~/db";
import { role } from "~/factory/api/classes/role";
import { execute } from "~/tasks";

export function replace(this: DB, roleName: string) {
  let self = this;

  return async function replaceMethod(options: FaunaRoleOptions = {}) {
    return execute(
      [
        {
          name: `Replace [${roleName}]`,
          task() {
            return self.query(role.replace(roleName, options));
          },
        },
      ],
      {
        domain: "DB.role.replace",
      }
    );
  };
}
