import { FactoryDatabase } from '~/types/factory/factory.database';
import { FrameworkDatabaseApi } from '~/types/framework/framework.database';
import { database } from '~/factory/api/database';
import { execute } from '~/tools/tasks';

export const forget: FactoryDatabase<FrameworkDatabaseApi['forget']> = function (databaseName) {
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
};
