import { query as q } from "faunadb";
import { FaunaId, FaunaPaginateOptions } from "~/../types/fauna";
import { DB } from "~/db";
import { collectionNameNormalized } from "~/factory/classes/collection";
import { execute } from "~/tasks";

export function activity(this: DB, collectionName: string, id: FaunaId) {
  let self = this;

  return async function activityMethod(pagination?: FaunaPaginateOptions) {
    return execute(
      [
        {
          name: `Activity for (${collectionName})`,
          async task() {
            return self.collection(collectionNameNormalized("actions")).find(
              {
                document: q.Ref(q.Collection(collectionName), id),
              },
              pagination
            );
          },
        },
      ],
      {
        domain: "DB.document.activity",
      }
    );
  };
}
