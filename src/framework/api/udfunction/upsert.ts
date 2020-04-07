import { FaunaRoleOptions } from "~/../types/fauna";
import { DB } from "~/db";
import { udfunction } from "~/factory/api/classes/udfunction";
import { execute } from "~/tasks";

export function upsert(this: DB, collectionName: string) {
  let self = this;

  return async function upsertMethod(options: FaunaRoleOptions = {}) {
    return execute(
      [
        {
          name: `Update/Insert udfunction [${collectionName}]`,
          task() {
            return self.query(udfunction.upsert(collectionName, options));
          },
        },
      ],
      {
        domain: "DB.collection.upsert",
      }
    );
  };
}
