import { DB } from "~/db";
import { FaunaCollectionOptions, DBFrameworkCollectionInsertOptions, Fauna } from "~/../types/db";
import { collection } from "~/factory/api/collection";
import { execute } from "~/tasks";

export function insert(this: DB, collectionDefinition: FaunaCollectionOptions) {
  let self = this;

  return async function insertMethod(data: any, options?: DBFrameworkCollectionInsertOptions) {
    let { keepId = false } = options || {};
    const { id, credentials } = data || {};

    return execute(
      [
        {
          name: (keepId ? `Upserting ${id}` : `Inserting`) + ` in ${collectionDefinition.name}`,
          task() {
            if (keepId) {
              if (!id) throw new Error(`Doesn't have any given id`);
              return self.query(collection(collectionDefinition.name).upsert(data.data || {}, { id, credentials }));
            } else {
              return self.query(collection(collectionDefinition.name).insert(data));
            }
          }
        }
      ],
      {
        domain: "DB.collection.insert"
      }
    );
  };
}
