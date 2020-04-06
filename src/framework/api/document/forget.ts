import { DB } from "~/db";
import { FaunaCollectionOptions, FaunaId } from "~/../types/fauna";
import { document } from "~/factory/api/classes/document";
import { execute } from "~/tasks";

export function forget(this: DB, collectionName: string, id: FaunaId) {
  let self = this;

  return async function forgetMethod() {
    return execute(
      [
        {
          name: `Forget (${id}) in (${collectionName})`,
          task() {
            return self.query(document.forget(collectionName, id));
          },
        },
      ],
      {
        domain: "DB.document.forget",
      }
    );
  };
}
