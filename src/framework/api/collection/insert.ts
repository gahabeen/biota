import { FaunaCollectionOptions } from "~/../types/fauna";
import { DBFrameworkCollectionInsertOptions } from "~/../types/framework/framework.collection";
import { DB } from "~/db";
import { document } from "~/factory/api/classes/document";
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
              return self.query(document.upsert(collectionDefinition.name, id, { credentials, data: data.data || {} }));
            } else {
              return self.query(document.insert(collectionDefinition.name, { data }));
            }
          },
        },
      ],
      {
        domain: "DB.collection.insert",
      }
    );
  };
}
