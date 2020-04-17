import { FactoryRole } from 'types/factory/factory.role';
import { FrameworkRoleApi } from 'types/framework/framework.role';
import { role } from '~/factory/api/role';
import { execute } from '~/tools/tasks';

export const membershipSetMany: FactoryRole<FrameworkRoleApi['membership']['setMany']> = function (roleName) {
  const self = this;

  return async (membershipList) => {
    return execute(
      [
        {
          name: `Set many memberships for [${roleName}]`,
          task() {
            return self.query(role(self.context)(roleName).membership.setMany(membershipList));
          },
        },
      ],
      {
        domain: 'Biota.role.membership.setMany',
      },
    );
  };
};
