import { FrameworkRolesApi } from 'types/framework/framework.roles';
import { roles } from '~/factory/api/roles';
import { execute } from '~/tools/tasks';

export const expireManyAt: FrameworkRolesApi['expireManyAt'] = async function (nameList, at) {
  const self = this;

  return execute(
    [
      {
        name: `Expire many roles at ${at}`,
        task() {
          return self.query(roles(self.context).expireManyAt(nameList, at));
        },
      },
    ],
    {
      domain: 'Biota.roles.expireManyAt',
    },
  );
};
