import { query as q } from 'faunadb';
import { FaunaId, FaunaPaginateOptions } from '~/../types/fauna';
import { Biota } from '~/biota';
import { BiotaCollectionName } from '~/factory/constructors/collection';
import { execute } from '~/tasks';

export function activity(this: Biota, collectionName: string, id: FaunaId) {
  const self = this;

  return async function activityMethod(pagination: FaunaPaginateOptions = {}) {
    return execute(
      [
        {
          name: `Activity for (${collectionName})`,
          async task() {
            return self.collection(BiotaCollectionName('actions')).find(
              {
                document: q.Ref(q.Collection(collectionName), id),
              },
              pagination,
            );
          },
        },
      ],
      {
        domain: 'Biota.document.activity',
      },
    );
  };
}
