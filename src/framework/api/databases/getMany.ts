import { FrameworkDatabasesApi } from 'types/framework/framework.databases';
import { databases } from '~/factory/api/databases';
import { execute } from '~/tools/tasks';

export const getMany: FrameworkDatabasesApi['getMany'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Get many databases`,
        task() {
          return self.query(databases(self.context).getMany(nameList));
        },
      },
    ],
    {
      domain: 'Biota.databases.getMany',
    },
  );
};
