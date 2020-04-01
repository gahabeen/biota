import { DB } from "~/db";
import { FaunaCollectionOptions, FaunaId } from "~/../types/db";
import { collection } from "~/factory/api/collection";
import { execute } from "~/tasks";

export function update(this: DB, collectionDefinition: FaunaCollectionOptions) {
  let self = this;

  return async function updateMethod(id: FaunaId, data: object) {
    return execute([
      {
        name: `Update (${id}) in (${collectionDefinition.name})`,
        task() {
          return self.query(collection(collectionDefinition.name).update(id, data));
        }
      }
    ], {
      domain: "DB.collection.update"
    });
  };
}
