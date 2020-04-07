import { FaunaRoleOptions } from "~/../types/fauna";
import { DB } from "~/db";
import { database } from "~/factory/api/classes/database";
import { execute } from "~/tasks";

export function update(this: DB, databaseName: string) {
  let self = this;

  return async function updateMethod(options: FaunaRoleOptions = {}) {
    return execute(
      [
        {
          name: `Update database [${databaseName}]`,
          task() {
            return self.query(database.update(databaseName, options));
          },
        },
      ],
      {
        domain: "DB.database.update",
      }
    );
  };
}
