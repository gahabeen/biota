import { DB } from "~/db";
import { FaunaCollectionOptions, FaunaId } from "~/../types/db";
import { collection } from "~/factory/api/classes/collection";
import { execute } from "~/tasks";

export function get(this: DB, collectionDefinition: FaunaCollectionOptions) {
  let self = this;

  return async function getMethod(id: FaunaId) {
    return execute(
      [
        {
          name: `Get (${id}) in (${collectionDefinition.name})`,
          task() {
            return self.query(collection(collectionDefinition.name).get(id));
          }
        }
      ],
      {
        domain: "DB.collection.get"
      }
    );
  };
}
