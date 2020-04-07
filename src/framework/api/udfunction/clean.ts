import { DB } from "~/db";
import { udfunction } from "~/factory/api/classes/udfunction";
import { execute } from "~/tasks";

export function clean(this: DB, udfunctionName: string) {
  let self = this;

  return async function cleanMethod() {
    return execute(
      [
        {
          name: `Clean udfunction [${udfunctionName}]`,
          task() {
            return self.query(udfunction.clean(udfunctionName));
          },
        },
      ],
      {
        domain: "DB.udfunction.clean",
      }
    );
  };
}
