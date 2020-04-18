import { FactoryDatabase } from '~/types/factory/factory.database';
import { FrameworkDatabaseApi } from '~/types/framework/framework.database';
import { database } from '~/factory/api/database';
import { execute } from '~/tools/tasks';

export const drop: FactoryDatabase<FrameworkDatabaseApi['drop']> = function (databaseName) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Drop (${databaseName})`,
          task() {
            return self.query(database(self.context)(databaseName).drop());
          },
        },
      ],
      {
        domain: 'Biota.database.drop',
      },
    );
  };
};
