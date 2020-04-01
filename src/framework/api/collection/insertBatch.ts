// types
// external
import { query as q } from "faunadb";
import { Fauna, FaunaCollectionOptions, DBFrameworkCollectionInsertBatchOptions } from "~/../types/db";
import * as helpers from "~/helpers";
// biota
import { collection } from "~/factory/api/collection";
import { execute } from "~/tasks";
import { DB } from "~/db";

export function insertBatch(this: DB, collectionDefinition: FaunaCollectionOptions) {
  let self = this;

  return async function insertBatchMethod(data: object[], options: DBFrameworkCollectionInsertBatchOptions = {}) {
    let { batchSize = 50, keepId = false } = options;
    let items = data;
    if (!Array.isArray(items)) items = [items];
    let batches = helpers.splitEvery(batchSize, items);
    let tasks = [];

    let query: Fauna.Expr;

    if (keepId) {
      query = q.Let(
        {
          data: q.Select("data", q.Var("item"), {}),
          credentials: q.Select("credentials", q.Var("item"), {}),
          id: q.Select("id", q.Var("item"), null)
        },
        q.If(
          q.Var("id"),
          collection(collectionDefinition.name).upsert(q.Var("data"), {
            id: q.Var("id"),
            credentials: q.Var("credentials")
          }),
          null
        )
      );
    } else {
      query = collection(collectionDefinition.name).insert(q.Var("item"));
    }

    for (let [index, batch] of Object.entries(batches)) {
      tasks.push({
        name: `Inserting batch n°${index + 1} on ${batches.length}`,
        task() {
          return self.query(q.Map(batch, q.Lambda("item", query)));
        }
      });
    }
    return execute(tasks, {
      domain: "DB.collection.insertBatch"
    });
  };
}
