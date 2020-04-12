import { query as q } from 'faunadb';
import { FaunaPaginateOptions } from '~/../types/fauna';
import { Biota } from '~/biota';
import { execute } from '~/tasks';
import { BiotaCollectionName } from '~/factory/classes/collection';

export function activity(this: Biota, collectionName: string) {
  const self = this;

  return async function activityMethod(pagination: FaunaPaginateOptions = {}) {
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
