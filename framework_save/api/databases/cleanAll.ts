import { Biota } from '~/biota';
import { database } from '~/factory/api/classes/database';
import { execute } from '~/tasks';

export function dropAll(this: Biota) {
  const self = this;
  return execute(
    [
      {
        name: `Clean all databases`,
        task() {
          return self.query(database.dropAll.call(self));
        },
      },
    ],
    {
      domain: 'Biota.databases.dropAll',
    },
  );
}
