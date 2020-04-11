import { query as q } from 'faunadb';
import { FaunaPaginateOptions } from '~/../types/fauna';
import { DB } from '~/db';
import { execute } from '~/tasks';
import { collectionNameNormalized } from '~/factory/classes/collection';

export function activity(this: DB, databaseName: string) {
  const self = this;

  return async function activityMethod(pagination: FaunaPaginateOptions = {}) {
    return execute(
      [
        {
          name: `Activity for database [${databaseName}]`,
          async task() {
            return self.collection(collectionNameNormalized('actions')).find(
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
        domain: 'DB.database.activity',
      },
    );
  };
}
