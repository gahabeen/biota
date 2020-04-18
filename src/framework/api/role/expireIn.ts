import { FactoryRole } from '~/types/factory/factory.role';
import { FrameworkRoleApi } from '~/types/framework/framework.role';
import { role } from '~/factory/api/role';
import { execute } from '~/tools/tasks';

export const expireIn: FactoryRole<FrameworkRoleApi['expireIn']> = function (roleName) {
  const self = this;

  return async (delay) => {
    return execute(
      [
        {
          name: `Expire [${roleName}] delayd of ${delay}ms`,
          task() {
            return self.query(role(self.context)(roleName).expireIn(delay));
          },
        },
      ],
      {
        domain: 'Biota.role.expireIn',
      },
    );
  };
};
