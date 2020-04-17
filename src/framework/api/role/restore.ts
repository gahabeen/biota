import { FactoryRole } from 'types/factory/factory.role';
import { FrameworkRoleApi } from 'types/framework/framework.role';
import { Biota } from '~/biota';
import { role } from '~/factory/api/role';
import { execute } from '~/tools/tasks';

export const restore: FactoryRole<FrameworkRoleApi['restore']> = function (this: Biota, roleName) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Restore [${roleName}]`,
          task() {
            return self.query(role(self.context)(roleName).restore());
          },
        },
      ],
      {
        domain: 'Biota.role.restore',
      },
    );
  };
};
