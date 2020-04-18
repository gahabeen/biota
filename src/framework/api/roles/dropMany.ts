import { FrameworkRolesApi } from '~/types/framework/framework.roles';
import { roles } from '~/factory/api/roles';
import { execute } from '~/tools/tasks';

export const dropMany: FrameworkRolesApi['dropMany'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Drop many roles`,
        task() {
          return self.query(roles(self.context).dropMany(nameList));
        },
      },
    ],
    {
      domain: 'Biota.roles.dropMany',
    },
  );
};
