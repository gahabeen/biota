import { query as q } from 'faunadb';
import { FaunaPaginateOptions } from '~/types/fauna';
import { Biota } from '~/biota';
import { execute } from '~/tools/tasks';
import { BiotaCollectionName } from '~/factory/constructors/collection';

export function activity(this: Biota, collectionName: string) {
  const self = this;

  return async (pagination: FaunaPaginateOptions = {}) => {
    return execute(
      [
        {
          name: `Activity for (${collectionName})`,
          async task() {
            return self.collection(BiotaCollectionName('actions')).find(
              {
                collection: {
                  $computed: q.Collection(collectionName),
                },
              },
              pagination,
            );
          },
        },
      ],
      {
        domain: 'Biota.collection.activity',
      },
    );
  };
}
