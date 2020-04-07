import { DB } from "~/db";
import { FaunaCollectionOptions, FaunaId, FaunaRoleOptions } from "~/../types/fauna";
import { role } from "~/factory/api/classes/role";
import { execute } from "~/tasks";

export function upsert(this: DB, collectionName: string) {
  let self = this;

  return async function upsertMethod(options: FaunaRoleOptions = {}) {
    return execute(
      [
        {
          name: `Update/Insert [${collectionName}]`,
          task() {
            return self.query(role.upsert(collectionName, options));
          },
        },
      ],
      {
        domain: "DB.collection.upsert",
      }
    );
  };
}
