import { DB } from "~/db";
import { database } from "~/factory/api/classes/database";
import { execute } from "~/tasks";

export function clean(this: DB, databaseName: string) {
  let self = this;

  return async function cleanMethod() {
    return execute(
      [
        {
          name: `Clean database [${databaseName}]`,
          task() {
            return self.query(database.clean.call(self, databaseName));
          },
        },
      ],
      {
        domain: "DB.database.clean",
      }
    );
  };
}
