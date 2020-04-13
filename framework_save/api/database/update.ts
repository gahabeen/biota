import { FaunaDatabaseOptions } from '~/../types/fauna';
import { Biota } from '~/biota';
import { database } from '~/factory/api/classes/database';
import { execute } from '~/tasks';

export function update(this: Biota, databaseName: string) {
  const self = this;

  return async function updateMethod(options: FaunaDatabaseOptions = {}) {
    return execute(
      [
        {
          name: `Update database [${databaseName}]`,
          task() {
            return self.query(database.update.call(self, databaseName, options));
          },
        },
      ],
      {
        domain: 'Biota.database.update',
      },
    );
  };
}
