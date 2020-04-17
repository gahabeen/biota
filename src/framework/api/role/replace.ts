import { FactoryRole } from 'types/factory/factory.role';
import { FrameworkRoleApi } from 'types/framework/framework.role';
import { role } from '~/factory/api/role';
import { execute } from '~/tools/tasks';

export const replace: FactoryRole<FrameworkRoleApi['replace']> = function (roleName) {
  const self = this;

  return async function replaceMethod(options) {
    return execute(
      [
        {
          name: `Replace (${roleName})`,
          task() {
            return self.query(role(self.context)(roleName).replace(options));
          },
        },
      ],
      {
        domain: 'Biota.role.replace',
      },
    );
  };
};
