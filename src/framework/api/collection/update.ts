import { DB } from "~/db";
import { FaunaCollectionOptions, FaunaId } from "~/../types/fauna";
import { document } from "~/factory/api/classes/document";
import { execute } from "~/tasks";

export function update(this: DB, collectionDefinition: FaunaCollectionOptions) {
  let self = this;

  return async function updateMethod(id: FaunaId, data: object) {
    return execute(
      [
        {
          name: `Update (${id}) in (${collectionDefinition.name})`,
          task() {
            return self.query(document.update(collectionDefinition.name, id, { data }));
          },
        },
      ],
      {
        domain: "DB.collection.update",
      }
    );
  };
}
