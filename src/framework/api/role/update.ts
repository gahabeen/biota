import { FactoryRole } from '~/types/factory/factory.role';
import { FrameworkRoleApi } from '~/types/framework/framework.role';
import { role } from '~/factory/api/role';
import { execute } from '~/tools/tasks';

export const update: FactoryRole<FrameworkRoleApi['update']> = function (roleName) {
  const self = this;

  return async function updateMethod(data) {
    return execute(
      [
        {
          name: `Update (${roleName})`,
          task() {
            return self.query(role(self.context)(roleName).update(data));
          },
        },
      ],
      {
        domain: 'Biota.role.update',
      },
    );
  };
};
