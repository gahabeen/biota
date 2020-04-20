import { FactoryRole } from '~/types/factory/factory.role';
import { FrameworkRoleApi } from '~/types/framework/framework.role';
import { role } from '~/factory/api/role';
import { execute } from '~/tools/tasks';
import { Privilege } from '~/factory/constructors/privilege';

export const privilegeScaffold: FactoryRole<FrameworkRoleApi['privilege']['scaffold']> = function (roleName) {
  const self = this;

  return async (privilege) => {
    return execute(
      [
        {
          name: `Scaffold privilege for [${roleName}]`,
          task() {
            return self.query(role(self.context)(roleName).privilege.set(Privilege(privilege)));
          },
        },
      ],
      {
        domain: 'Biota.role.privilege.scaffold',
      },
    );
  };
};
