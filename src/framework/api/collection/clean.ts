import { FaunaId } from "~/../types/fauna";
import { DB } from "~/db";
import { collection } from "~/factory/api/classes/collection";
import { execute } from "~/tasks";

export function clean(this: DB, collectionName: string) {
  let self = this;

  return async function cleanMethod() {
    return execute(
      [
        {
          name: `Clean everything in (${collectionName})`,
          task() {
            return self.query(collection.clean(collectionName));
          },
        },
      ],
      {
        domain: "DB.collection.clean",
      }
    );
  };
}
