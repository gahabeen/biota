import { Biota } from '~/biota';
import { collection } from '~/factory/api/classes/collection';
import { execute } from '~/tasks';

export function dropAll(this: Biota) {
  const self = this;
  return execute(
    [
      {
        name: `Clean all collections`,
        task() {
          return self.query(collection.dropAll.call(self));
        },
      },
    ],
    {
      domain: 'Biota.collections.dropAll',
    },
  );
}
