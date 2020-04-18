import { FrameworkDatabasesApi } from '~/types/framework/framework.databases';
import { databases } from '~/factory/api/databases';
import { execute } from '~/tools/tasks';

export const dropMany: FrameworkDatabasesApi['dropMany'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Drop many databases`,
        task() {
          return self.query(databases(self.context).dropMany(nameList));
        },
      },
    ],
    {
      domain: 'Biota.databases.dropMany',
    },
  );
};
