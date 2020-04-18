import { FactoryDatabase } from '~/types/factory/factory.database';
import { FrameworkDatabaseApi } from '~/types/framework/framework.database';
import { database } from '~/factory/api/database';
import { execute } from '~/tools/tasks';

export const get: FactoryDatabase<FrameworkDatabaseApi['get']> = function (databaseName) {
  const self = this;

  return async function getMethod() {
    return execute(
      [
        {
          name: `Get (${databaseName})`,
          task() {
            return self.query(database(self.context)(databaseName).get());
          },
        },
      ],
      {
        domain: 'Biota.database.get',
      },
    );
  };
};
