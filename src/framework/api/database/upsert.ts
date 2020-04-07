import { FaunaDatabaseOptions } from "~/../types/fauna";
import { DB } from "~/db";
import { database } from "~/factory/api/classes/database";
import { execute } from "~/tasks";

export function upsert(this: DB, collectionName: string) {
  let self = this;

  return async function upsertMethod(options: FaunaDatabaseOptions = {}) {
    return execute(
      [
        {
          name: `Update/Insert database [${collectionName}]`,
          task() {
            return self.query(database.upsert(collectionName, options));
          },
        },
      ],
      {
        domain: "DB.collection.upsert",
      }
    );
  };
}
