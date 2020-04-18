import { FrameworkRolesApi } from '~/types/framework/framework.roles';
import { roles } from '~/factory/api/roles';
import { execute } from '~/tools/tasks';

export const deleteMany: FrameworkRolesApi['deleteMany'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Delete many roles`,
        task() {
          return self.query(roles(self.context).deleteMany(nameList));
        },
      },
    ],
    {
      domain: 'Biota.roles.deleteMany',
    },
  );
};
