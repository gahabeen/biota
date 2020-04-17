import { FactoryDatabase } from 'types/factory/factory.database';
import { FrameworkDatabaseApi } from 'types/framework/framework.database';
import { database } from '~/factory/api/database';
import { execute } from '~/tools/tasks';

export const replace: FactoryDatabase<FrameworkDatabaseApi['replace']> = function (databaseName) {
  const self = this;

  return async function replaceMethod(options) {
    return execute(
      [
        {
          name: `Replace (${databaseName})`,
          task() {
            return self.query(database(self.context)(databaseName).replace(options));
          },
        },
      ],
      {
        domain: 'Biota.database.replace',
      },
    );
  };
};
