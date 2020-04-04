import { DB } from "~/db";
import { FaunaCollectionOptions, FaunaId } from "~/../types/db";
import { collection } from "~/factory/api/classes/collection";
import { execute } from "~/tasks";

export function repsert(this: DB, collectionDefinition: FaunaCollectionOptions) {
  let self = this;

  return async function repsertMethod(id: FaunaId, data: object) {
    return execute([
      {
        name: `Replace/Insert (${id}) in (${collectionDefinition.name})`,
        task() {
          return self.query(collection(collectionDefinition.name).repsert(id, data));
        }
      }
    ],
    {
      domain: "DB.collection.repsert"
    });
  };
}
