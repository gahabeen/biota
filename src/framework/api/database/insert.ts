import { FaunaId } from '~/../types/fauna';
import { Biota } from '~/biota';
import { database } from '~/factory/api/database';
import { execute } from '~/tools/tasks';

export function insert(this: Biota, databaseName: string) {
  const self = this;

  return async function insertMethod(data: any = {}, id: FaunaId = null) {
    return execute(
      [
        {
          name: `Insert data in [${databaseName}]`,
          task() {
            return self.query(database(self.context)(databaseName).insert(data));
          },
        },
      ],
      {
        domain: 'Biota.database.insert',
      },
    );
  };
}
