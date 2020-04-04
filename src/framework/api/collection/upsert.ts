import { DB } from "~/db";
import { FaunaCollectionOptions, FaunaId } from "~/../types/fauna";
import { document } from "~/factory/api/classes/document";
import { execute } from "~/tasks";

export function upsert(this: DB, collectionDefinition: FaunaCollectionOptions) {
  let self = this;

  return async function upsertMethod(id: FaunaId, data: object) {
    return execute(
      [
        {
          name: `Update/Insert (${id}) in (${collectionDefinition.name})`,
          task() {
            return self.query(document.upsert(collectionDefinition.name, id, { data }));
          },
        },
      ],
      {
        domain: "DB.collection.upsert",
      }
    );
  };
}
