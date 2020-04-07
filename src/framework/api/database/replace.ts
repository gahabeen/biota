import { FaunaDatabaseOptions } from "~/../types/fauna";
import { DB } from "~/db";
import { database } from "~/factory/api/classes/database";
import { execute } from "~/tasks";

export function replace(this: DB, databaseName: string) {
  let self = this;

  return async function replaceMethod(options: FaunaDatabaseOptions = {}) {
    return execute(
      [
        {
          name: `Replace database [${databaseName}]`,
          task() {
            return self.query(database.replace(databaseName, options));
          },
        },
      ],
      {
        domain: "DB.database.replace",
      }
    );
  };
}
