import { DB } from "~/db";
import { FaunaCollectionOptions, FaunaId } from "~/../types/fauna";
import { document } from "~/factory/api/classes/document";
import { execute } from "~/tasks";

export function upsert(this: DB, collectionName: string) {
  let self = this;

  return async function upsertMethod(id: FaunaId, data: object) {
    return execute(
      [
        {
          name: `Update/Insert (${id}) in (${collectionName})`,
          task() {
            return self.query(document.upsert(collectionName, id, data));
          },
        },
      ],
      {
        domain: "DB.collection.upsert",
      }
    );
  };
}
