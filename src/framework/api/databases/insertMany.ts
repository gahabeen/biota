import { FrameworkDatabasesApi } from 'types/framework/framework.databases';
import { databases } from '~/factory/api/databases';
import { execute } from '~/tools/tasks';

export const insertMany: FrameworkDatabasesApi['insertMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Insert many databases`,
        task() {
          return self.query(databases(self.context).insertMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.databases.insertMany',
    },
  );
};
