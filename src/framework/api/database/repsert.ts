import { Biota } from '~/biota';
import { FaunaCollectionOptions, FaunaId } from '~/../types/fauna';
import { database } from '~/factory/api/database';
import { execute } from '~/tools/tasks';

export function repsert(this: Biota, databaseName: string) {
  const self = this;

  return async function repsertMethod(id: FaunaId, data: object) {
    return execute(
      [
        {
          name: `Replace/Insert (${databaseName})`,
          task() {
            return self.query(database(self.context)(databaseName).repsert(data));
          },
        },
      ],
      {
        domain: 'Biota.database.repsert',
      },
    );
  };
}
