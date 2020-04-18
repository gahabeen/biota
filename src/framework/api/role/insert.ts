import { FactoryRole } from '~/types/factory/factory.role';
import { FrameworkRoleApi } from '~/types/framework/framework.role';
import { FaunaId } from '~/types/fauna';
import { role } from '~/factory/api/role';
import { execute } from '~/tools/tasks';

export const insert: FactoryRole<FrameworkRoleApi['insert']> = function (roleName) {
  const self = this;

  return async function insertMethod(data: any = {}, id: FaunaId = null) {
    return execute(
      [
        {
          name: `Insert data in [${roleName}]`,
          task() {
            return self.query(role(self.context)(roleName).insert(data));
          },
        },
      ],
      {
        domain: 'Biota.role.insert',
      },
    );
  };
};
