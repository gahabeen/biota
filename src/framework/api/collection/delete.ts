import { DB } from "~/db";
import { FaunaCollectionOptions, FaunaId } from "~/../types/fauna";
import { document } from "~/factory/api/classes/document";
import { execute } from "~/tasks";

export function deleteFn(this: DB, collectionName: string) {
  let self = this;

  return async function deleteMethod(id: FaunaId) {
    return execute(
      [
        {
          name: `Delete (${id}) in (${collectionName})`,
          task() {
            return self.query(document.delete(collectionName, id));
          },
        },
      ],
      {
        domain: "DB.collection.delete",
      }
    );
  };
}
