import { FaunaRoleOptions } from "~/../types/fauna";
import { DB } from "~/db";
import { udfunction } from "~/factory/api/classes/udfunction";
import { execute } from "~/tasks";

export function replace(this: DB, udfunctionName: string) {
  let self = this;

  return async function replaceMethod(options: FaunaRoleOptions = {}) {
    return execute(
      [
        {
          name: `Replace udfunction [${udfunctionName}]`,
          task() {
            return self.query(udfunction.replace(udfunctionName, options));
          },
        },
      ],
      {
        domain: "DB.udfunction.replace",
      }
    );
  };
}
