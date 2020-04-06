import { DB } from "~/db";
import { FaunaCollectionOptions, FaunaId } from "~/../types/fauna";
import { document } from "~/factory/api/classes/document";
import { execute } from "~/tasks";

export function get(this: DB, collectionName: string, id: FaunaId) {
  let self = this;

  return async function getMethod() {
    return execute(
      [
        {
          name: `Get (${id}) in (${collectionName})`,
          task() {
            return self.query(document.get(collectionName, id));
          },
        },
      ],
      {
        domain: "DB.document.get",
      }
    );
  };
}
