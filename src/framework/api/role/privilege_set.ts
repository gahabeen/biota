import { FactoryRole } from '~/types/factory/factory.role';
import { FrameworkRoleApi } from '~/types/framework/framework.role';
import { role } from '~/factory/api/role';
import { execute } from '~/tools/tasks';

export const privilegeSet: FactoryRole<FrameworkRoleApi['privilege']['set']> = function (roleName) {
  const self = this;
  return async (privilege) => {
    return execute(
      [
        {
          name: `Set privilege for [${roleName}]`,
          task() {
            return self.query(role(self.context)(roleName).privilege.set(privilege));
          },
        },
      ],
      {
        domain: 'Biota.role.privilege.set',
      },
    );
  };
};
