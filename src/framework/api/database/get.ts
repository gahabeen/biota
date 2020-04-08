import { DB } from "~/db";
import { FaunaCollectionOptions, FaunaId } from "~/../types/fauna";
import { database } from "~/factory/api/classes/database";
import { execute } from "~/tasks";

export function get(this: DB, databaseName: string) {
  let self = this;

  return async function getMethod() {
    return execute(
      [
        {
          name: `Get database [${databaseName}]`,
          task() {
            return self.query(database.get.call(self, databaseName));
          },
        },
      ],
      {
        domain: "DB.database.get",
      }
    );
  };
}
