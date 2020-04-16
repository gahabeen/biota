import { FaunaId } from '~/../types/fauna';
import { Biota } from '~/biota';
import { database } from '~/factory/api/database';
import { execute } from '~/tools/tasks';

export function update(this: Biota, databaseName: string) {
  const self = this;

  return async function updateMethod(id: FaunaId, data: object) {
    return execute(
      [
        {
          name: `Update (${databaseName})`,
          task() {
            return self.query(database(self.context)(databaseName).update(data));
          },
        },
      ],
      {
        domain: 'Biota.database.update',
      },
    );
  };
}
