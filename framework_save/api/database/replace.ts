import { FaunaDatabaseOptions } from '~/../types/fauna';
import { Biota } from '~/biota';
import { database } from '~/factory/api/database';
import { execute } from '~/tools/tasks';

export function replace(this: Biota, databaseName: string) {
  const self = this;

  return async function replaceMethod(options: FaunaDatabaseOptions = {}) {
    return execute(
      [
        {
          name: `Replace database [${databaseName}]`,
          task() {
            return self.query(database.replace.call(self, databaseName, options));
          },
        },
      ],
      {
        domain: 'Biota.database.replace',
      },
    );
  };
}
