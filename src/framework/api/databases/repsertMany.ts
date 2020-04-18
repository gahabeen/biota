import { FrameworkDatabasesApi } from '~/types/framework/framework.databases';
import { databases } from '~/factory/api/databases';
import { execute } from '~/tools/tasks';

export const repsertMany: FrameworkDatabasesApi['repsertMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Replace many databases`,
        task() {
          return self.query(databases(self.context).repsertMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.databases.repsertMany',
    },
  );
};
