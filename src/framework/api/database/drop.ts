import { FaunaId } from '~/../types/fauna';
import { Biota } from '~/biota';
import { database } from '~/factory/api/database';
import { execute } from '~/tools/tasks';

export function drop(this: Biota, databaseName: string) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Drop (${databaseName})`,
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
