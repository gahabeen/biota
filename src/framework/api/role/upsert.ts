import { FactoryRole } from 'types/factory/factory.role';
import { FrameworkRoleApi } from 'types/framework/framework.role';
import { role } from '~/factory/api/role';
import { execute } from '~/tools/tasks';

export const upsert: FactoryRole<FrameworkRoleApi['upsert']> = function (roleName) {
  const self = this;

  return async function upsertMethod(data) {
    return execute(
      [
        {
          name: `Update/Insert (${roleName})`,
          task() {
            return self.query(role(self.context)(roleName).upsert(data));
          },
        },
      ],
      {
        domain: 'Biota.role.upsert',
      },
    );
  };
};
