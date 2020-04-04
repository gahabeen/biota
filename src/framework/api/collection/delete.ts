import { DB } from "~/db";
import { FaunaCollectionOptions, FaunaId } from "~/../types/db";
import { collection } from "~/factory/api/classes/collection";
import { execute } from "~/tasks";

export function deleteFn(this: DB, collectionDefinition: FaunaCollectionOptions) {
  let self = this;

  return async function deleteMethod(id: FaunaId) {
    return execute([
      {
        name: `Delete (${id}) in (${collectionDefinition.name})`,
        task() {
          return self.query(collection(collectionDefinition.name).delete(id));
        }
      }
    ], {
      domain: "DB.collection.delete"
    });
  };
}
