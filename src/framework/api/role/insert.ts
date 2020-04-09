import { FaunaId, FaunaDocumentOptions, FaunaRoleOptions } from "~/../types/fauna";
import { DB } from "~/db";
import { role } from "~/factory/api/classes/role";
import { execute } from "~/tasks";

export function insert(this: DB, roleName: string) {
  let self = this;

  return async function insertMethod(options: FaunaRoleOptions = {}) {
    return execute(
      [
        {
          name: `Insert role [${roleName}]`,
          task() {
            return self.query(role.insert.call(self, roleName, options));
          },
        },
      ],
      {
        domain: "DB.role.insert",
      }
    );
  };
}
