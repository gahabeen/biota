import { FactoryDatabase } from 'types/factory/factory.database';
import { FrameworkDatabaseApi } from 'types/framework/framework.database';
import { database } from '~/factory/api/database';
import { execute } from '~/tools/tasks';

// tslint:disable-next-line: variable-name
export const delete_: FactoryDatabase<FrameworkDatabaseApi['delete']> = function (databaseName) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Delete (${databaseName})`,
          task() {
            return self.query(database(self.context)(databaseName).delete());
          },
        },
      ],
      {
        domain: 'Biota.database.delete',
      },
    );
  };
};
