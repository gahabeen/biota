import { Biota } from '~/biota';
import { database } from '~/factory/api/classes/database';
import { execute } from '~/tasks';

export function cleanAll(this: Biota) {
  const self = this;
  return execute(
    [
      {
        name: `Clean all databases`,
        task() {
          return self.query(database.cleanAll.call(self));
        },
      },
    ],
    {
      domain: 'Biota.databases.cleanAll',
    },
  );
}
