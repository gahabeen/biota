import { FrameworkRolesApi } from '~/types/framework/framework.roles';
import { roles } from '~/factory/api/roles';
import { execute } from '~/tools/tasks';

export const restoreMany: FrameworkRolesApi['restoreMany'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Restore many roles`,
        task() {
          return self.query(roles(self.context).restoreMany(nameList));
        },
      },
    ],
    {
      domain: 'Biota.roles.restoreMany',
    },
  );
};
