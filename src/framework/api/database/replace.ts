import { FaunaId } from '~/../types/fauna';
import { Biota } from '~/biota';
import { database } from '~/factory/api/database';
import { execute } from '~/tools/tasks';

export function replace(this: Biota, databaseName: string) {
  const self = this;

  return async function replaceMethod(id: FaunaId, data: object) {
    return execute(
      [
        {
          name: `Replace (${databaseName})`,
          task() {
            return self.query(database(self.context)(databaseName).replace(data));
          },
        },
      ],
      {
        domain: 'Biota.database.replace',
      },
    );
  };
}
