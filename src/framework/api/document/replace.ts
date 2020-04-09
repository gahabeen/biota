import { DB } from "~/db";
import { FaunaCollectionOptions, FaunaId } from "~/../types/fauna";
import { document } from "~/factory/api/classes/document";
import { execute } from "~/tasks";

export function replace(this: DB, collectionName: string, id: FaunaId) {
  let self = this;

  return async function replaceMethod(data: object) {
    return execute(
      [
        {
          name: `Replace (${id}) in (${collectionName})`,
          task() {
            return self.query(document.replace.call(self, collectionName, id, data));
          },
        },
      ],
      {
        domain: "DB.document.replace",
      }
    );
  };
}