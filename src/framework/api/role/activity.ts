import { query as q } from 'faunadb';
import { FaunaPaginateOptions } from '~/../types/fauna';
import { DB } from '~/db';
import { execute } from '~/tasks';
import { collectionNameNormalized } from '~/factory/classes/collection';

export function activity(this: DB, roleName: string) {
  const self = this;

  return async function activityMethod(pagination: FaunaPaginateOptions = {}) {
    return execute(
      [
        {
          name: `Activity for (${roleName})`,
          async task() {
            return self.collection(collectionNameNormalized('actions')).find(
              {
                collection: {
                  $computed: q.Role(roleName),
                },
              },
              pagination,
            );
          },
        },
      ],
      {
        domain: 'DB.role.activity',
      },
    );
  };
}
