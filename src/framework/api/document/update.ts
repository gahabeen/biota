import { DB } from "~/db";
import { FaunaCollectionOptions, FaunaId } from "~/../types/fauna";
import { document } from "~/factory/api/classes/document";
import { execute } from "~/tasks";

export function update(this: DB, collectionName: string, id: FaunaId) {
  let self = this;

  return async function updateMethod(data: object) {
    return execute(
      [
        {
          name: `Update (${id}) in (${collectionName})`,
          task() {
            return self.query(document.update(collectionName, id, data));
          },
        },
      ],
      {
        domain: "DB.document.update",
      }
    );
  };
}
