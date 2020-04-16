import { FrameworkDatabasesApi } from 'types/framework/framework.databases';
import { databases } from '~/factory/api/databases';
import { execute } from '~/tools/tasks';

export const findAll: FrameworkDatabasesApi['findAll'] = async function (pagination = {}) {
  const self = this;

  return execute(
    [
      {
        name: `Find all databases`,
        task() {
          return self.query(databases(self.context).findAll(pagination));
        },
      },
    ],
    {
      domain: 'Biota.databases.findAll',
    },
  );
};
