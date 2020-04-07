import { FaunaRoleOptions } from "~/../types/fauna";
import { DB } from "~/db";
import { udfunction } from "~/factory/api/classes/udfunction";
import { execute } from "~/tasks";

export function repsert(this: DB, udfunctionName: string) {
  let self = this;

  return async function repsertMethod(options: FaunaRoleOptions = {}) {
    return execute(
      [
        {
          name: `Replace/Insert udfunction [${udfunctionName}]`,
          task() {
            return self.query(udfunction.repsert(udfunctionName, options));
          },
        },
      ],
      {
        domain: "DB.udfunction.repsert",
      }
    );
  };
}
