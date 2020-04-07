import { FaunaId, FaunaDocumentOptions, FaunaRoleOptions } from "~/../types/fauna";
import { DB } from "~/db";
import { database } from "~/factory/api/classes/database";
import { execute } from "~/tasks";

export function insert(this: DB, databaseName: string) {
  let self = this;

  return async function insertMethod(options: FaunaRoleOptions = {}) {
    return execute(
      [
        {
          name: `Insert database [${databaseName}]`,
          task() {
            return self.query(database.insert(databaseName, options));
          },
        },
      ],
      {
        domain: "DB.database.insert",
      }
    );
  };
}
