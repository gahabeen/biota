import { DB } from "~/db";
import { FaunaCollectionOptions, FaunaId } from "~/../types/fauna";
import { document } from "~/factory/api/classes/document";
import { execute } from "~/tasks";

export function deleteFn(this: DB, collectionDefinition: FaunaCollectionOptions) {
  let self = this;

  return async function deleteMethod(id: FaunaId) {
    return execute(
      [
        {
          name: `Delete (${id}) in (${collectionDefinition.name})`,
          task() {
            return self.query(document.delete(collectionDefinition.name, id));
          },
        },
      ],
      {
        domain: "DB.collection.delete",
      }
    );
  };
}
