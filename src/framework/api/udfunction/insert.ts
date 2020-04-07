import { FaunaId, FaunaDocumentOptions, FaunaRoleOptions } from "~/../types/fauna";
import { DB } from "~/db";
import { udfunction } from "~/factory/api/classes/udfunction";
import { execute } from "~/tasks";

export function insert(this: DB, udfunctionName: string) {
  let self = this;

  return async function insertMethod(options: FaunaRoleOptions = {}) {
    return execute(
      [
        {
          name: `Insert udfunction [${udfunctionName}]`,
          task() {
            return self.query(udfunction.insert(udfunctionName, options));
          },
        },
      ],
      {
        domain: "DB.udfunction.insert",
      }
    );
  };
}
