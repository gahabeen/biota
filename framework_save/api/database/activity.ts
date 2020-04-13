import { query as q } from 'faunadb';
import { FaunaPaginateOptions } from '~/../types/fauna';
import { Biota } from '~/biota';
import { execute } from '~/tasks';
import { BiotaCollectionName } from '~/factory/constructors/collection';

export function activity(this: Biota, databaseName: string) {
  const self = this;

  return async function activityMethod(pagination: FaunaPaginateOptions = {}) {
    return execute(
      [
        {
          name: `Activity for database [${databaseName}]`,
          async task() {
            return self.collection(BiotaCollectionName('actions')).find(
              {
                collection: {
                  $computed: q.Role(databaseName),
                },
              },
              pagination,
            );
          },
        },
      ],
      {
        domain: 'Biota.database.activity',
      },
    );
  };
}
