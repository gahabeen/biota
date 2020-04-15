import { Biota } from '~/biota';
import { database } from '~/factory/api/classes/database';
import { execute } from '~/tasks';

export function drop(this: Biota, databaseName: string) {
  const self = this;

  return async function dropMethod() {
    return execute(
      [
        {
          name: `Clean database [${databaseName}]`,
          task() {
            return self.query(database.drop.call(self, databaseName));
          },
        },
      ],
      {
        domain: 'Biota.database.drop',
      },
    );
  };
}
