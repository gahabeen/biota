import { FaunaDatabaseOptions } from '~/../types/fauna';
import { DB } from '~/db';
import { database } from '~/factory/api/classes/database';
import { execute } from '~/tasks';

export function upsert(this: DB, collectionName: string) {
  const self = this;

  return async function upsertMethod(options: FaunaDatabaseOptions = {}) {
    return execute(
      [
        {
          name: `Update/Insert database [${collectionName}]`,
          task() {
            return self.query(database.upsert.call(self, collectionName, options));
          },
        },
      ],
      {
        domain: 'DB.collection.upsert',
      },
    );
  };
}
