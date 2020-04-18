import { FrameworkRolesApi } from '~/types/framework/framework.roles';
import { roles } from '~/factory/api/roles';
import { execute } from '~/tools/tasks';

export const expireManyNow: FrameworkRolesApi['expireManyNow'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Expire many roles now`,
        task() {
          return self.query(roles(self.context).expireManyNow(nameList));
        },
      },
    ],
    {
      domain: 'Biota.roles.expireManyNow',
    },
  );
};
