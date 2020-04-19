import { FactoryRole } from '~/types/factory/factory.role';
import { FrameworkRoleApi } from '~/types/framework/framework.role';
import { Biota } from '~/biota';
import { role } from '~/factory/api/role';
import { execute } from '~/tools/tasks';

export const remember: FactoryRole<FrameworkRoleApi['remember']> = function (this: Biota, roleName) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Remember [${roleName}]`,
          task() {
            return self.query(role(self.context)(roleName).remember());
          },
        },
      ],
      {
        domain: 'Biota.role.remember',
      },
    );
  };
};
