import { DB } from "~/db";
import { FaunaCollectionOptions, FaunaId } from "~/../types/db";
import { collection } from "~/factory/api/classes/collection";
import { execute } from "~/tasks";

export function forget(this: DB, collectionDefinition: FaunaCollectionOptions) {
  let self = this;

  return async function forgetMethod(id: FaunaId) {
    return execute(
      [
        {
          name: `Forget (${id}) in (${collectionDefinition.name})`,
          task() {
            return self.query(collection(collectionDefinition.name).forget(id));
          }
        }
      ],
      {
        domain: "DB.collection.forget"
      }
    );
  };
}
