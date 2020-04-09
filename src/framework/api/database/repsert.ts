import { FaunaDatabaseOptions } from "~/../types/fauna";
import { DB } from "~/db";
import { database } from "~/factory/api/classes/database";
import { execute } from "~/tasks";

export function repsert(this: DB, databaseName: string) {
  let self = this;

  return async function repsertMethod(options: FaunaDatabaseOptions = {}) {
    return execute(
      [
        {
          name: `Replace/Insert database [${databaseName}]`,
          task() {
            return self.query(database.repsert.call(self, databaseName, options));
          },
        },
      ],
      {
        domain: "DB.database.repsert",
      }
    );
  };
}
