import { FactoryRole } from '~/types/factory/factory.role';
import { FrameworkRoleApi } from '~/types/framework/framework.role';
import { role } from '~/factory/api/role';
import { execute } from '~/tools/tasks';
import { PrivilegeRights } from '~/factory/constructors/privilege';

export const privilegescaffoldMany: FactoryRole<FrameworkRoleApi['privilege']['scaffoldMany']> = function (roleName) {
  const self = this;

  return async (privileges = []) => {
    return execute(
      [
        {
          name: `Scaffold many privileges for [${roleName}]`,
          task() {
            return self.query(role(self.context)(roleName).privilege.setMany(privileges.map(PrivilegeRights)));
          },
        },
      ],
      {
        domain: 'Biota.role.privilege.scaffoldMany',
      },
    );
  };
};
