import { FrameworkDatabasesApi } from 'types/framework/framework.databases';
import { databases } from '~/factory/api/databases';
import { execute } from '~/tools/tasks';

export const deleteMany: FrameworkDatabasesApi['deleteMany'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Delete many databases`,
        task() {
          return self.query(databases(self.context).deleteMany(nameList));
        },
      },
    ],
    {
      domain: 'Biota.databases.deleteMany',
    },
  );
};
