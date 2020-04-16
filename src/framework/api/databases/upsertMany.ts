import { FrameworkDatabasesApi } from 'types/framework/framework.databases';
import { databases } from '~/factory/api/databases';
import { execute } from '~/tools/tasks';

export const upsertMany: FrameworkDatabasesApi['upsertMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Upsert many databases`,
        task() {
          return self.query(databases(self.context).upsertMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.databases.upsertMany',
    },
  );
};
