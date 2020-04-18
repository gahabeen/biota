import { FactoryRole } from '~/types/factory/factory.role';
import { FrameworkRoleApi } from '~/types/framework/framework.role';
import { role } from '~/factory/api/role';
import { execute } from '~/tools/tasks';

// tslint:disable-next-line: variable-name
export const delete_: FactoryRole<FrameworkRoleApi['delete']> = function (roleName) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Delete (${roleName})`,
          task() {
            return self.query(role(self.context)(roleName).delete());
          },
        },
      ],
      {
        domain: 'Biota.role.delete',
      },
    );
  };
};
