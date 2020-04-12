import { Biota } from '~/biota';
import { FaunaCollectionOptions, FaunaId } from '~/../types/fauna';
import { database } from '~/factory/api/classes/database';
import { execute } from '~/tasks';

export function delete_(this: Biota, databaseName: string) {
  const self = this;

  return async function deleteMethod() {
    return execute(
      [
        {
          name: `Delete database [${databaseName}]`,
          task() {
            return self.query(database.delete.call(self, databaseName));
          },
        },
      ],
      {
        domain: 'Biota.database.delete',
      },
    );
  };
}
