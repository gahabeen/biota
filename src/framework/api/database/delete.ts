import { DB } from "~/db";
import { FaunaCollectionOptions, FaunaId } from "~/../types/fauna";
import { database } from "~/factory/api/classes/database";
import { execute } from "~/tasks";

export function delete_(this: DB, databaseName: string) {
  let self = this;

  return async function deleteMethod() {
    return execute(
      [
        {
          name: `Delete database [${databaseName}]`,
          task() {
            return self.query(database.delete(databaseName));
          },
        },
      ],
      {
        domain: "DB.database.delete",
      }
    );
  };
}
