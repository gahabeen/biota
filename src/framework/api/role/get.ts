import { FactoryRole } from 'types/factory/factory.role';
import { FrameworkRoleApi } from 'types/framework/framework.role';
import { role } from '~/factory/api/role';
import { execute } from '~/tools/tasks';

export const get: FactoryRole<FrameworkRoleApi['get']> = function (roleName) {
  const self = this;

  return async function getMethod() {
    return execute(
      [
        {
          name: `Get (${roleName})`,
          task() {
            return self.query(role(self.context)(roleName).get());
          },
        },
      ],
      {
        domain: 'Biota.role.get',
      },
    );
  };
};
