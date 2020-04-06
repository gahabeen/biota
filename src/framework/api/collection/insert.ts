import { FaunaId, FaunaDocumentOptions } from "~/../types/fauna";
import { DB } from "~/db";
import { document } from "~/factory/api/classes/document";
import { execute } from "~/tasks";

export function insert(this: DB, collectionName: string) {
  let self = this;

  return async function insertMethod(data: any = {}, id: FaunaId = null) {
    return execute(
      [
        {
          name: `Insert data in [${collectionName}]`,
          task() {
            return self.query(document.insert(collectionName, data, id));
          },
        },
      ],
      {
        domain: "DB.collection.insert",
      }
    );
  };
}
