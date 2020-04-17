import { FactoryRole } from 'types/factory/factory.role';
import { FrameworkRoleApi } from 'types/framework/framework.role';
import { role } from '~/factory/api/role';
import { execute } from '~/tools/tasks';

export const drop: FactoryRole<FrameworkRoleApi['drop']> = function (roleName) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Drop (${roleName})`,
          task() {
            return self.query(role(self.context)(roleName).drop());
          },
        },
      ],
      {
        domain: 'Biota.role.drop',
      },
    );
  };
};
