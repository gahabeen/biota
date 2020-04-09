import { FaunaRoleOptions } from "~/../types/fauna";
import { DB } from "~/db";
import { role } from "~/factory/api/classes/role";
import { execute } from "~/tasks";

export function repsert(this: DB, roleName: string) {
  let self = this;

  return async function repsertMethod(options: FaunaRoleOptions = {}) {
    return execute(
      [
        {
          name: `Replace/Insert [${roleName}]`,
          task() {
            return self.query(role.repsert.call(self, roleName, options));
          },
        },
      ],
      {
        domain: "DB.role.repsert",
      }
    );
  };
}
