import { FaunaId } from "~/../types/fauna";
import { DB } from "~/db";
import { udfunction } from "~/factory/api/classes/udfunction";
import { execute } from "~/tasks";

export function forget(this: DB, udfunctionName: string) {
  let self = this;

  return async function forgetMethod() {
    return execute(
      [
        {
          name: `Forget udfunction [${udfunctionName}]`,
          task() {
            return self.query(udfunction.forget.call(self, udfunctionName));
          },
        },
      ],
      {
        domain: "DB.udfunction.forget",
      }
    );
  };
}
