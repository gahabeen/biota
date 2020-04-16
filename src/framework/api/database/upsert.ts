import { FaunaId } from '~/../types/fauna';
import { Biota } from '~/biota';
import { database } from '~/factory/api/database';
import { execute } from '~/tools/tasks';

export function upsert(this: Biota, databaseName: string) {
  const self = this;

  return async function upsertMethod(id: FaunaId, data: object) {
    return execute(
      [
        {
          name: `Update/Insert (${databaseName})`,
          task() {
            return self.query(database(self.context)(databaseName).upsert(data));
          },
        },
      ],
      {
        domain: 'Biota.database.upsert',
      },
    );
  };
}
