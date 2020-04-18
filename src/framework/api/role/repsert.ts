import { FactoryRole } from '~/types/factory/factory.role';
import { FrameworkRoleApi } from '~/types/framework/framework.role';
import { role } from '~/factory/api/role';
import { execute } from '~/tools/tasks';

export const repsert: FactoryRole<FrameworkRoleApi['repsert']> = function (roleName) {
  const self = this;

  return async function repsertMethod(options) {
    return execute(
      [
        {
          name: `Replace/Insert (${roleName})`,
          task() {
            return self.query(role(self.context)(roleName).repsert(options));
          },
        },
      ],
      {
        domain: 'Biota.role.repsert',
      },
    );
  };
};
