import { FrameworkRolesApi } from 'types/framework/framework.roles';
import { roles } from '~/factory/api/roles';
import { execute } from '~/tools/tasks';

export const updateMany: FrameworkRolesApi['updateMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Update many roles`,
        task() {
          return self.query(roles(self.context).updateMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.roles.updateMany',
    },
  );
};
