import { FactoryDatabase } from 'types/factory/factory.database';
import { FrameworkDatabaseApi } from 'types/framework/framework.database';
import { database } from '~/factory/api/database';
import { execute } from '~/tools/tasks';

export const repsert: FactoryDatabase<FrameworkDatabaseApi['repsert']> = function (databaseName) {
  const self = this;

  return async function repsertMethod(options) {
    return execute(
      [
        {
          name: `Replace/Insert (${databaseName})`,
          task() {
            return self.query(database(self.context)(databaseName).repsert(options));
          },
        },
      ],
      {
        domain: 'Biota.database.repsert',
      },
    );
  };
};
