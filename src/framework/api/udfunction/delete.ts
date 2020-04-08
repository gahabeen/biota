import { DB } from "~/db";
import { FaunaCollectionOptions, FaunaId } from "~/../types/fauna";
import { udfunction } from "~/factory/api/classes/udfunction";
import { execute } from "~/tasks";

export function delete_(this: DB, udfunctionName: string) {
  let self = this;

  return async function deleteMethod() {
    return execute(
      [
        {
          name: `Delete udfunction [${udfunctionName}]`,
          task() {
            return self.query(udfunction.delete.call(self, udfunctionName));
          },
        },
      ],
      {
        domain: "DB.udfunction.delete",
      }
    );
  };
}
