import { FrameworkRolesApi } from 'types/framework/framework.roles';
import { roles } from '~/factory/api/roles';
import { execute } from '~/tools/tasks';

export const expireManyIn: FrameworkRolesApi['expireManyIn'] = async function (nameList, delay) {
  const self = this;

  return execute(
    [
      {
        name: `Expire many roles in ${delay}ms`,
        task() {
          return self.query(roles(self.context).expireManyIn(nameList, delay));
        },
      },
    ],
    {
      domain: 'Biota.roles.expireManyIn',
    },
  );
};
