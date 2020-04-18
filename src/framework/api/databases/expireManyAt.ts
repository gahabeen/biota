import { FrameworkDatabasesApi } from '~/types/framework/framework.databases';
import { databases } from '~/factory/api/databases';
import { execute } from '~/tools/tasks';

export const expireManyAt: FrameworkDatabasesApi['expireManyAt'] = async function (nameList, at) {
  const self = this;

  return execute(
    [
      {
        name: `Expire many databases at ${at}`,
        task() {
          return self.query(databases(self.context).expireManyAt(nameList, at));
        },
      },
    ],
    {
      domain: 'Biota.databases.expireManyAt',
    },
  );
};
