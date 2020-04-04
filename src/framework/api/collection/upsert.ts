import { DB } from "~/db";
import { FaunaCollectionOptions, FaunaId } from "~/../types/db";
import { collection } from "~/factory/api/classes/collection";
import { execute } from "~/tasks";

export function upsert(this: DB, collectionDefinition: FaunaCollectionOptions) {
  let self = this;

  return async function upsertMethod(id: FaunaId, data: object) {
    return execute(
      [
        {
          name: `Update/Insert (${id}) in (${collectionDefinition.name})`,
          task() {
            return self.query(collection(collectionDefinition.name).upsert(id, data));
          }
        }
      ],
      {
        domain: "DB.collection.upsert"
      }
    );
  };
}
