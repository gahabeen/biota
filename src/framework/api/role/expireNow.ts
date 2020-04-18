import { FactoryRole } from '~/types/factory/factory.role';
import { FrameworkRoleApi } from '~/types/framework/framework.role';
import { role } from '~/factory/api/role';
import { execute } from '~/tools/tasks';

export const expireNow: FactoryRole<FrameworkRoleApi['expireNow']> = function (roleName) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Expire [${roleName}] now`,
          task() {
            return self.query(role(self.context)(roleName).expireNow());
          },
        },
      ],
      {
        domain: 'Biota.role.expireNow',
      },
    );
  };
};
