import { FrameworkDatabasesApi } from '~/types/framework/framework.databases';
import { databases } from '~/factory/api/databases';
import { execute } from '~/tools/tasks';

export const expireManyIn: FrameworkDatabasesApi['expireManyIn'] = async function (nameList, delay) {
  const self = this;

  return execute(
    [
      {
        name: `Expire many databases in ${delay}ms`,
        task() {
          return self.query(databases(self.context).expireManyIn(nameList, delay));
        },
      },
    ],
    {
      domain: 'Biota.databases.expireManyIn',
    },
  );
};
