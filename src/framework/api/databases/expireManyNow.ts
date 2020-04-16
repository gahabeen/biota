import { FrameworkDatabasesApi } from 'types/framework/framework.databases';
import { databases } from '~/factory/api/databases';
import { execute } from '~/tools/tasks';

export const expireManyNow: FrameworkDatabasesApi['expireManyNow'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Expire many databases now`,
        task() {
          return self.query(databases(self.context).expireManyNow(nameList));
        },
      },
    ],
    {
      domain: 'Biota.databases.expireManyNow',
    },
  );
};
