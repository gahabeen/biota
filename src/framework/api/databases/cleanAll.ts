import { DB } from "~/db";
import { database } from "~/factory/api/classes/database";
import { execute } from "~/tasks";

export function cleanAll(this: DB) {
  let self = this;
  return execute(
    [
      {
        name: `Clean all databases`,
        task() {
          return self.query(database.cleanAll.call(self));
        },
      },
    ],
    {
      domain: "DB.databases.cleanAll",
    }
  );
}
