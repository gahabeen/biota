import { FaunaDatabaseOptions } from '~/../types/fauna';
import { Biota } from '~/biota';
import { database } from '~/factory/api/database';
import { execute } from '~/tools/tasks';

export function repsert(this: Biota, databaseName: string) {
  const self = this;

  return async function repsertMethod(options: FaunaDatabaseOptions = {}) {
    return execute(
      [
        {
          name: `Replace/Insert database [${databaseName}]`,
          task() {
            return self.query(database.repsert.call(self, databaseName, options));
          },
        },
      ],
      {
        domain: 'Biota.database.repsert',
      },
    );
  };
}
