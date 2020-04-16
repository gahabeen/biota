import { FaunaPaginateOptions } from '~/../types/fauna';
import { Biota } from '~/biota';
import { Identity } from '~/factory/api/ql';
import { BiotaCollectionName } from '~/factory/constructors/collection';
import { execute } from '~/tools/tasks';

export async function activity(this: Biota, pagination: FaunaPaginateOptions = {}) {
  const self = this;
  return execute(
    [
      {
        name: `User activity`,
        async task() {
          return self.collection(BiotaCollectionName('actions')).find(
            {
              user: Identity(),
            },
            pagination,
          );
        },
      },
    ],
    {
      domain: 'Biota.user.activity',
    },
  );
}
