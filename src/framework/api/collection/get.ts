import { DB } from "~/db";
import { FaunaCollectionOptions, FaunaId } from "~/../types/fauna";
import { document } from "~/factory/api/classes/document";
import { execute } from "~/tasks";

export function get(this: DB, collectionDefinition: FaunaCollectionOptions) {
  let self = this;

  return async function getMethod(id: FaunaId) {
    return execute(
      [
        {
          name: `Get (${id}) in (${collectionDefinition.name})`,
          task() {
            return self.query(document.get(collectionDefinition.name, id));
          },
        },
      ],
      {
        domain: "DB.collection.get",
      }
    );
  };
}
