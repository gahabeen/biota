import { FactoryDatabase } from '~/types/factory/factory.database';
import { FrameworkDatabaseApi } from '~/types/framework/framework.database';
import { database } from '~/factory/api/database';
import { execute } from '~/tools/tasks';

export const expireAt: FactoryDatabase<FrameworkDatabaseApi['expireAt']> = function (databaseName) {
  const self = this;

  return async (at) => {
    return execute(
      [
        {
          name: `Expire [${databaseName}] at ${at}`,
          task() {
            return self.query(database(self.context)(databaseName).expireAt(at));
          },
        },
      ],
      {
        domain: 'Biota.database.expireAt',
      },
    );
  };
};
