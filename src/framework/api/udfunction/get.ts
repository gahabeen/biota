import { DB } from "~/db";
import { FaunaCollectionOptions, FaunaId } from "~/../types/fauna";
import { udfunction } from "~/factory/api/classes/udfunction";
import { execute } from "~/tasks";

export function get(this: DB, udfunctionName: string) {
  let self = this;

  return async function getMethod() {
    return execute(
      [
        {
          name: `Get udfunction [${udfunctionName}]`,
          task() {
            return self.query(udfunction.get.call(self, udfunctionName));
          },
        },
      ],
      {
        domain: "DB.udfunction.get",
      }
    );
  };
}
