import { FactoryDatabase } from 'types/factory/factory.database';
import { FrameworkDatabaseApi } from 'types/framework/framework.database';
import { FaunaId } from '~/../types/fauna';
import { database } from '~/factory/api/database';
import { execute } from '~/tools/tasks';

export const insert: FactoryDatabase<FrameworkDatabaseApi['drop']> = function (databaseName) {
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
};
