import { FrameworkRolesApi } from 'types/framework/framework.roles';
import { roles } from '~/factory/api/roles';
import { execute } from '~/tools/tasks';

export const findAll: FrameworkRolesApi['findAll'] = async function (pagination = {}) {
  const self = this;

  return execute(
    [
      {
        name: `Find all roles`,
        task() {
          return self.query(roles(self.context).findAll(pagination));
        },
      },
    ],
    {
      domain: 'Biota.roles.findAll',
    },
  );
};
