import { FrameworkRolesApi } from '~/types/framework/framework.roles';
import { roles } from '~/factory/api/roles';
import { execute } from '~/tools/tasks';

export const getMany: FrameworkRolesApi['getMany'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Get many roles`,
        task() {
          return self.query(roles(self.context).getMany(nameList));
        },
      },
    ],
    {
      domain: 'Biota.roles.getMany',
    },
  );
};
