import { FactoryDatabase } from 'types/factory/factory.database';
import { FrameworkDatabaseApi } from 'types/framework/framework.database';
import { database } from '~/factory/api/database';
import { execute } from '~/tools/tasks';

export const expireIn: FactoryDatabase<FrameworkDatabaseApi['expireIn']> = function (databaseName) {
  const self = this;

  return async (delay) => {
    return execute(
      [
        {
          name: `Expire [${databaseName}] delayd of ${delay}ms`,
          task() {
            return self.query(database(self.context)(databaseName).expireIn(delay));
          },
        },
      ],
      {
        domain: 'Biota.database.expireIn',
      },
    );
  };
};
