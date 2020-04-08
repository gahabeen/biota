import { DB } from "~/db";
import { FaunaCollectionOptions, FaunaId } from "~/../types/fauna";
import { document } from "~/factory/api/classes/document";
import { execute } from "~/tasks";

export function delete_(this: DB, collectionName: string, id: FaunaId) {
  let self = this;

  return async function deleteMethod() {
    return execute(
      [
        {
          name: `Delete (${id}) in (${collectionName})`,
          task() {
            return self.query(document.delete.call(self, collectionName, id));
          },
        },
      ],
      {
        domain: "DB.document.delete",
      }
    );
  };
}
