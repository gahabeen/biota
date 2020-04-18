import { FrameworkRolesApi } from '~/types/framework/framework.roles';
import { roles } from '~/factory/api/roles';
import { execute } from '~/tools/tasks';

export const replaceMany: FrameworkRolesApi['replaceMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Replace many roles`,
        task() {
          return self.query(roles(self.context).replaceMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.roles.replaceMany',
    },
  );
};
