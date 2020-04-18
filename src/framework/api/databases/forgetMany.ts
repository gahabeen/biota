import { FrameworkDatabasesApi } from '~/types/framework/framework.databases';
import { databases } from '~/factory/api/databases';
import { execute } from '~/tools/tasks';

export const forgetMany: FrameworkDatabasesApi['forgetMany'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Forget many databases`,
        task() {
          return self.query(databases(self.context).forgetMany(nameList));
        },
      },
    ],
    {
      domain: 'Biota.databases.forgetMany',
    },
  );
};
