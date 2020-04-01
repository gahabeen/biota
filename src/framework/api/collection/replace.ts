import { DB } from "~/db";
import { FaunaCollectionOptions, FaunaId } from "~/../types/db";
import { collection } from "~/factory/api/collection";
import { execute } from "~/tasks";

export function replace(this: DB, collectionDefinition: FaunaCollectionOptions) {
  let self = this;

  return async function replaceMethod(id: FaunaId, data: object) {
    return execute([
      {
        name: `Replace (${id}) in (${collectionDefinition.name})`,
        task() {
          return self.query(collection(collectionDefinition.name).replace(id, data));
        }
      }
    ],
    {
      domain: "DB.collection.replace"
    });
  };
}
