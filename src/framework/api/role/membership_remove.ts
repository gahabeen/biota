import { FactoryRole } from 'types/factory/factory.role';
import { FrameworkRoleApi } from 'types/framework/framework.role';
import { role } from '~/factory/api/role';
import { execute } from '~/tools/tasks';

export const membershipRemove: FactoryRole<FrameworkRoleApi['membership']['remove']> = function (roleName) {
  const self = this;

  return async (resource) => {
    return execute(
      [
        {
          name: `Remove membership for [${roleName}]`,
          task() {
            return self.query(role(self.context)(roleName).membership.remove(resource));
          },
        },
      ],
      {
        domain: 'Biota.role.membership.remove',
      },
    );
  };
};
