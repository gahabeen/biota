import { FaunaId } from '~/../types/fauna';
import { Biota } from '~/biota';
import { database } from '~/factory/api/database';
import { execute } from '~/tools/tasks';

export function forget(this: Biota, databaseName: string) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Forget (${databaseName})`,
          task() {
            return self.query(database(self.context)(databaseName).forget());
          },
        },
      ],
      {
        domain: 'Biota.database.forget',
      },
    );
  };
}
