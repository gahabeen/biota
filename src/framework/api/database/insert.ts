import { FaunaId, FaunaDocumentOptions, FaunaDatabaseOptions } from '~/../types/fauna';
import { DB } from '~/db';
import { database } from '~/factory/api/classes/database';
import { execute } from '~/tasks';

export function insert(this: DB, databaseName: string) {
  const self = this;

  return async function insertMethod(options: FaunaDatabaseOptions = {}) {
    return execute(
      [
        {
          name: `Insert database [${databaseName}]`,
          task() {
            return self.query(database.insert.call(self, databaseName, options));
          },
        },
      ],
      {
        domain: 'DB.database.insert',
      },
    );
  };
}
