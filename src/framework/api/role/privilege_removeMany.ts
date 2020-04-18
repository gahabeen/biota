import { FactoryRole } from '~/types/factory/factory.role';
import { FrameworkRoleApi } from '~/types/framework/framework.role';
import { role } from '~/factory/api/role';
import { execute } from '~/tools/tasks';

export const privilegeRemoveMany: FactoryRole<FrameworkRoleApi['privilege']['removeMany']> = function (roleName) {
  const self = this;

  return async (resourceList) => {
    return execute(
      [
        {
          name: `Remove many privileges for [${roleName}]`,
          task() {
            return self.query(role(self.context)(roleName).privilege.removeMany(resourceList));
          },
        },
      ],
      {
        domain: 'Biota.role.privilege.removeMany',
      },
    );
  };
};
