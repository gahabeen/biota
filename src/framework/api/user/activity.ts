import { FaunaPaginateOptions } from '~/../types/fauna';
import { Biota } from '~/biota';
import { Identity } from '~/factory/api/ql';
import { collectionNameNormalized } from '~/factory/classes/collection';
import { execute } from '~/tasks';

export async function activity(this: Biota, pagination: FaunaPaginateOptions = {}) {
  const self = this;
  return execute(
    [
      {
        name: `User activity`,
        async task() {
          return self.collection(collectionNameNormalized('actions')).find(
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
