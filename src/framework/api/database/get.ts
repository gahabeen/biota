import { FaunaId } from '~/../types/fauna';
import { Biota } from '~/biota';
import { database } from '~/factory/api/database';
import { execute } from '~/tools/tasks';

export function get(this: Biota, databaseName: string) {
  const self = this;

  return async function getMethod() {
    return execute(
      [
        {
          name: `Get (${databaseName})`,
          task() {
            return self.query(database(self.context)(databaseName).get());
          },
        },
      ],
      {
        domain: 'Biota.database.get',
      },
    );
  };
}
