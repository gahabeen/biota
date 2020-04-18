import { query as q } from 'faunadb';
import { Fauna, FaunaCollectionOptions } from '~/types/fauna';
import { FrameworkCollectionInsertBatchOptions } from '~/types/framework/framework.collection';
import { Biota } from '~/biota';
import { collection } from '~/factory/api/collection';
import { document } from '~/factory/api/document';
import * as helpers from '~/helpers';
import { execute } from '~/tools/tasks';

export function insertBatch(this: Biota, collectionName: string) {
  const self = this;

  return async (data: object[], options: FrameworkCollectionInsertBatchOptions = {}) => {
    const { batchSize = 50, keepId = false } = options;
    let items = data;
    if (!Array.isArray(items)) items = [items];
    const batches = helpers.splitEvery(batchSize, items);
    const tasks = [];

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
          document(self.context)(collectionName, q.Var('id')).upsert(
            q.Var('data'),
            //   {
            //   data: q.Var('data'),
            //   credentials: q.Var('credentials'),
            // }
          ),
          null,
        ),
      );
    } else {
      query = collection(self.context)(collectionName).insert({ data: q.Var('item') });
    }

    for (const [index, batch] of Object.entries(batches)) {
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
