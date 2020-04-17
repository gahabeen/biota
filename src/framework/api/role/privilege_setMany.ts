import { FactoryRole } from 'types/factory/factory.role';
import { FrameworkRoleApi } from 'types/framework/framework.role';
import { role } from '~/factory/api/role';
import { execute } from '~/tools/tasks';

export const privilegeSetMany: FactoryRole<FrameworkRoleApi['privilege']['setMany']> = function (roleName) {
  const self = this;

  return async (privilegeList) => {
    return execute(
      [
        {
          name: `Set many privileges for [${roleName}]`,
          task() {
            return self.query(role(self.context)(roleName).privilege.setMany(privilegeList));
          },
        },
      ],
      {
        domain: 'Biota.role.privilege.setMany',
      },
    );
  };
};
