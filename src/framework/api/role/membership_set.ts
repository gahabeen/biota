import { FactoryRole } from '~/types/factory/factory.role';
import { FrameworkRoleApi } from '~/types/framework/framework.role';
import { role } from '~/factory/api/role';
import { execute } from '~/tools/tasks';

export const membershipSet: FactoryRole<FrameworkRoleApi['membership']['set']> = function (roleName) {
  const self = this;

  return async (membership) => {
    return execute(
      [
        {
          name: `Set membership for [${roleName}]`,
          task() {
            return self.query(role(self.context)(roleName).membership.set(membership));
          },
        },
      ],
      {
        domain: 'Biota.role.membership.set',
      },
    );
  };
};
