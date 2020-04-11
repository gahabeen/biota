import { query as q } from 'faunadb';
import { FaunaPaginateOptions } from '~/../types/fauna';
import { DB } from '~/db';
import { execute } from '~/tasks';
import { collectionNameNormalized } from '~/factory/classes/collection';

export function activity(this: DB, udfunctionName: string) {
  const self = this;

  return async function activityMethod(pagination: FaunaPaginateOptions = {}) {
    return execute(
      [
        {
          name: `Activity for udfunction [${udfunctionName}]`,
          async task() {
            return self.collection(collectionNameNormalized('actions')).find(
              {
                collection: {
                  $computed: q.Role(udfunctionName),
                },
              },
              pagination,
            );
          },
        },
      ],
      {
        domain: 'DB.udfunction.activity',
      },
    );
  };
}
