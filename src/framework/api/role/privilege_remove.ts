import { FactoryRole } from '~/types/factory/factory.role';
import { FrameworkRoleApi } from '~/types/framework/framework.role';
import { role } from '~/factory/api/role';
import { execute } from '~/tools/tasks';

export const privilegeRemove: FactoryRole<FrameworkRoleApi['privilege']['remove']> = function (roleName) {
  const self = this;

  return async (resource) => {
    return execute(
      [
        {
          name: `Remove privilege for [${roleName}]`,
          task() {
            return self.query(role(self.context)(roleName).privilege.remove(resource));
          },
        },
      ],
      {
        domain: 'Biota.role.privilege.remove',
      },
    );
  };
};
