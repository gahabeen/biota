import { DB } from "~/db";
import { FaunaCollectionOptions, FaunaId } from "~/../types/fauna";
import { document } from "~/factory/api/classes/document";
import { execute } from "~/tasks";

export function replace(this: DB, collectionDefinition: FaunaCollectionOptions) {
  let self = this;

  return async function replaceMethod(id: FaunaId, data: object) {
    return execute(
      [
        {
          name: `Replace (${id}) in (${collectionDefinition.name})`,
          task() {
            return self.query(document.replace(collectionDefinition.name, id, data));
          },
        },
      ],
      {
        domain: "DB.collection.replace",
      }
    );
  };
}
