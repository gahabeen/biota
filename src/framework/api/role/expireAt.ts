import { FactoryRole } from '~/types/factory/factory.role';
import { FrameworkRoleApi } from '~/types/framework/framework.role';
import { role } from '~/factory/api/role';
import { execute } from '~/tools/tasks';

export const expireAt: FactoryRole<FrameworkRoleApi['expireAt']> = function (roleName) {
  const self = this;

  return async (at) => {
    return execute(
      [
        {
          name: `Expire [${roleName}] at ${at}`,
          task() {
            return self.query(role(self.context)(roleName).expireAt(at));
          },
        },
      ],
      {
        domain: 'Biota.role.expireAt',
      },
    );
  };
};
