import { FaunaId } from '~/../types/fauna';
import { Biota } from '~/biota';
import { database } from '~/factory/api/database';
import { execute } from '~/tools/tasks';

export function delete_(this: Biota, databaseName: string) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Delete (${databaseName})`,
          task() {
            return self.query(database(self.context)(databaseName).delete());
          },
        },
      ],
      {
        domain: 'Biota.database.delete',
      },
    );
  };
}
