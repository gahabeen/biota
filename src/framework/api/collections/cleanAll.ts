import { Biota } from '~/biota';
import { collection } from '~/factory/api/classes/collection';
import { execute } from '~/tasks';

export function cleanAll(this: Biota) {
  const self = this;
  return execute(
    [
      {
        name: `Clean all collections`,
        task() {
          return self.query(collection.cleanAll.call(self));
        },
      },
    ],
    {
      domain: 'Biota.collections.cleanAll',
    },
  );
}
