import { FrameworkRolesApi } from '~/types/framework/framework.roles';
import { roles } from '~/factory/api/roles';
import { execute } from '~/tools/tasks';

export const insertMany: FrameworkRolesApi['insertMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Insert many roles`,
        task() {
          return self.query(roles(self.context).insertMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.roles.insertMany',
    },
  );
};
