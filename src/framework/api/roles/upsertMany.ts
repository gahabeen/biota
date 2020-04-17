import { FrameworkRolesApi } from 'types/framework/framework.roles';
import { roles } from '~/factory/api/roles';
import { execute } from '~/tools/tasks';

export const upsertMany: FrameworkRolesApi['upsertMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Upsert many roles`,
        task() {
          return self.query(roles(self.context).upsertMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.roles.upsertMany',
    },
  );
};
