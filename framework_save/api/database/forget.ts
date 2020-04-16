import { FaunaId } from '~/../types/fauna';
import { Biota } from '~/biota';
import { database } from '~/factory/api/database';
import { execute } from '~/tools/tasks';

export function forget(this: Biota, databaseName: string) {
  const self = this;

  return async function forgetMethod() {
    return execute(
      [
        {
          name: `Forget database [${databaseName}]`,
          task() {
            return self.query(database.forget.call(self, databaseName));
          },
        },
      ],
      {
        domain: 'Biota.database.forget',
      },
    );
  };
}
