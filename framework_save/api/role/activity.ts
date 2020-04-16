import { query as q } from 'faunadb';
import { FaunaPaginateOptions } from '~/../types/fauna';
import { Biota } from '~/biota';
import { execute } from '~/tools/tasks';
import { BiotaCollectionName } from '~/factory/constructors/collection';

export function activity(this: Biota, roleName: string) {
  const self = this;

  return async function activityMethod(pagination: FaunaPaginateOptions = {}) {
    return execute(
      [
        {
          name: `Activity for (${roleName})`,
          async task() {
            return self.collection(BiotaCollectionName('actions')).find(
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
        domain: 'Biota.role.activity',
      },
    );
  };
}
