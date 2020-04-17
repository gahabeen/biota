import { FactoryDatabase } from 'types/factory/factory.database';
import { FrameworkDatabaseApi } from 'types/framework/framework.database';
import { database } from '~/factory/api/database';
import { execute } from '~/tools/tasks';

export const upsert: FactoryDatabase<FrameworkDatabaseApi['upsert']> = function (databaseName) {
  const self = this;

  return async function upsertMethod(data) {
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
};
