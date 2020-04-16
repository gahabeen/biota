import { FactoryDatabase } from 'types/factory/factory.database';
import { FrameworkDatabaseApi } from 'types/framework/framework.database';
import { database } from '~/factory/api/database';
import { execute } from '~/tools/tasks';

export const expireNow: FactoryDatabase<FrameworkDatabaseApi['expireNow']> = function (databaseName) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Expire [${databaseName}] now`,
          task() {
            return self.query(database(self.context)(databaseName).expireNow());
          },
        },
      ],
      {
        domain: 'Biota.database.expireNow',
      },
    );
  };
};
