import { Biota } from '~/biota';
import { database } from '~/factory/api/database';
import { execute } from '~/tools/tasks';

export function drop(this: Biota, databaseName: string) {
  const self = this;

  return async function dropMethod() {
    return execute(
      [
        {
          name: `Clean everything in (${databaseName})`,
          task() {
            return self.query(database(self.context)(databaseName).drop());
          },
        },
      ],
      {
        domain: 'Biota.database.drop',
      },
    );
  };
}
