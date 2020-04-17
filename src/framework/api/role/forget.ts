import { FactoryRole } from 'types/factory/factory.role';
import { FrameworkRoleApi } from 'types/framework/framework.role';
import { role } from '~/factory/api/role';
import { execute } from '~/tools/tasks';

export const forget: FactoryRole<FrameworkRoleApi['forget']> = function (roleName) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Forget (${roleName})`,
          task() {
            return self.query(role(self.context)(roleName).forget());
          },
        },
      ],
      {
        domain: 'Biota.role.forget',
      },
    );
  };
};
