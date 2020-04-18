import { FrameworkDatabasesApi } from '~/types/framework/framework.databases';
import { databases } from '~/factory/api/databases';
import { execute } from '~/tools/tasks';

export const restoreMany: FrameworkDatabasesApi['restoreMany'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Restore many databases`,
        task() {
          return self.query(databases(self.context).restoreMany(nameList));
        },
      },
    ],
    {
      domain: 'Biota.databases.restoreMany',
    },
  );
};
