import { DB } from "~/db";
import { role } from "~/factory/api/classes/role";
import { execute } from "~/tasks";

export function cleanAll(this: DB) {
  let self = this;
  return execute(
    [
      {
        name: `Clean all roles`,
        task() {
          return self.query(role.cleanAll());
        },
      },
    ],
    {
      domain: "DB.roles.cleanAll",
    }
  );
}
