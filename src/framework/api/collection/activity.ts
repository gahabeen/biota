import { query as q } from "faunadb";
import { FaunaPaginateOptions } from "~/../types/fauna";
import { DB } from "~/db";
import { execute } from "~/tasks";
import { collectionNameNormalized } from "~/factory/classes/collection";

export function activity(this: DB, collectionName: string) {
  let self = this;

  return async function activityMethod(pagination: FaunaPaginateOptions) {
    return execute(
      [
        {
          name: `Activity for (${collectionName})`,
          async task() {
            return self.collection(collectionNameNormalized("actions")).find(
              {
                collection: {
                  $computed: q.Collection(collectionName),
                },
              },
              pagination
            );
          },
        },
      ],
      {
        domain: "DB.collection.activity",
      }
    );
  };
}
