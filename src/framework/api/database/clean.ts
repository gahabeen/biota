import { Biota } from '~/biota';
import { database } from '~/factory/api/classes/database';
import { execute } from '~/tasks';

export function clean(this: Biota, databaseName: string) {
  const self = this;

  return async function cleanMethod() {
    return execute(
      [
        {
          name: `Clean database [${databaseName}]`,
          task() {
            return self.query(database.clean.call(self, databaseName));
          },
        },
      ],
      {
        domain: 'Biota.database.clean',
      },
    );
  };
}
