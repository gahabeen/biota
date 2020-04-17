import { FactoryDatabase } from 'types/factory/factory.database';
import { FrameworkDatabaseApi } from 'types/framework/framework.database';
import { database } from '~/factory/api/database';
import { execute } from '~/tools/tasks';

export const update: FactoryDatabase<FrameworkDatabaseApi['update']> = function (databaseName) {
  const self = this;

  return async function updateMethod(data) {
    return execute(
      [
        {
          name: `Update (${databaseName})`,
          task() {
            return self.query(database(self.context)(databaseName).update(data));
          },
        },
      ],
      {
        domain: 'Biota.database.update',
      },
    );
  };
};
