import { FrameworkRolesApi } from 'types/framework/framework.roles';
import { roles } from '~/factory/api/roles';
import { execute } from '~/tools/tasks';

export const forgetMany: FrameworkRolesApi['forgetMany'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Forget many roles`,
        task() {
          return self.query(roles(self.context).forgetMany(nameList));
        },
      },
    ],
    {
      domain: 'Biota.roles.forgetMany',
    },
  );
};
