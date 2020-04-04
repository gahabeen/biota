import { DB } from "~/db";
import { FaunaCollectionOptions, FaunaId } from "~/../types/fauna";
import { document } from "~/factory/api/classes/document";
import { execute } from "~/tasks";

export function forget(this: DB, collectionDefinition: FaunaCollectionOptions) {
  let self = this;

  return async function forgetMethod(id: FaunaId) {
    return execute(
      [
        {
          name: `Forget (${id}) in (${collectionDefinition.name})`,
          task() {
            return self.query(document.forget(collectionDefinition.name, id));
          },
        },
      ],
      {
        domain: "DB.collection.forget",
      }
    );
  };
}
