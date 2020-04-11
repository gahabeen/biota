import { DB } from '~/db';
import { collection } from '~/factory/api/classes/collection';
import { execute } from '~/tasks';

export function cleanAll(this: DB) {
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
      domain: 'DB.collections.cleanAll',
    },
  );
}
