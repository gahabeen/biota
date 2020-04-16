import { FrameworkDatabasesApi } from 'types/framework/framework.databases';
import { databases } from '~/factory/api/databases';
import { execute } from '~/tools/tasks';

export const updateMany: FrameworkDatabasesApi['updateMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Update many databases`,
        task() {
          return self.query(databases(self.context).updateMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.databases.updateMany',
    },
  );
};
