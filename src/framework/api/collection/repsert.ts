import { DB } from "~/db";
import { FaunaCollectionOptions, FaunaId } from "~/../types/fauna";
import { document } from "~/factory/api/classes/document";
import { execute } from "~/tasks";

export function repsert(this: DB, collectionDefinition: FaunaCollectionOptions) {
  let self = this;

  return async function repsertMethod(id: FaunaId, data: object) {
    return execute(
      [
        {
          name: `Replace/Insert (${id}) in (${collectionDefinition.name})`,
          task() {
            return self.query(document.repsert(collectionDefinition.name, id, { data }));
          },
        },
      ],
      {
        domain: "DB.collection.repsert",
      }
    );
  };
}
