import { query as q } from 'faunadb';
import { Fauna, FaunaCollectionOptions } from '~/../types/fauna';
import { BiotaFrameworkCollectionInsertBatchOptions } from '~/../types/framework/framework.collection';
import { Biota } from '~/biota';
import { document } from '~/factory/api/classes/document';
import * as helpers from '~/helpers';
import { execute } from '~/tasks';

export function insertBatch(this: Biota, collectionName: string) {
  const self = this;

  return async function insertBatchMethod(data: object[], options: BiotaFrameworkCollectionInsertBatchOptions = {}) {
    let { batchSize = 50, keepId = false } = options;
    let items = data;
    if (!Array.isArray(items)) items = [items];
    let batches = helpers.splitEvery(batchSize, items);
    let tasks = [];

    let query: Fauna.Expr;

    if (keepId) {
      query = q.Let(
        {
          data: q.Select('data', q.Var('item'), {}),
          credentials: q.Select('credentials', q.Var('item'), {}),
          id: q.Select('id', q.Var('item'), null),
        },
        q.If(
          q.Var('id'),
          document.upsert(collectionName, q.Var('id'), {
            data: q.Var('data'),
            credentials: q.Var('credentials'),
          }),
          null,
        ),
      );
    } else {
      query = document.insert(collectionName, { data: q.Var('item') });
    }

    for (let [index, batch] of Object.entries(batches)) {
      tasks.push({
        name: `Inserting batch n°${index + 1} on ${batches.length}`,
        task() {
          return self.query(q.Map(batch, q.Lambda('item', query)));
        },
      });
    }
    return execute(tasks, {
      domain: 'Biota.collection.insertBatch',
    });
  };
}
