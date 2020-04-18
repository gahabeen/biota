import { FactoryRole } from '~/types/factory/factory.role';
import { FrameworkRoleApi } from '~/types/framework/framework.role';
import { role } from '~/factory/api/role';
import { execute } from '~/tools/tasks';

export const membershipRemoveMany: FactoryRole<FrameworkRoleApi['membership']['removeMany']> = function (roleName) {
  const self = this;

  return async (resourceList) => {
    return execute(
      [
        {
          name: `Remove many memberships for [${roleName}]`,
          task() {
            return self.query(role(self.context)(roleName).membership.removeMany(resourceList));
          },
        },
      ],
      {
        domain: 'Biota.role.membership.removeMany',
      },
    );
  };
};
