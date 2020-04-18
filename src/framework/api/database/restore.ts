import { FactoryDatabase } from '~/types/factory/factory.database';
import { FrameworkDatabaseApi } from '~/types/framework/framework.database';
import { Biota } from '~/biota';
import { database } from '~/factory/api/database';
import { execute } from '~/tools/tasks';

export const restore: FactoryDatabase<FrameworkDatabaseApi['restore']> = function (this: Biota, databaseName) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Restore [${databaseName}]`,
          task() {
            return self.query(database(self.context)(databaseName).restore());
          },
        },
      ],
      {
        domain: 'Biota.database.restore',
      },
    );
  };
};
