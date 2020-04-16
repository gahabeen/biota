import { FaunaRoleOptions } from '~/../types/fauna';
import { Biota } from '~/biota';
import { role } from '~/factory/api/role';
import { execute } from '~/tools/tasks';

export function update(this: Biota, roleName: string) {
  const self = this;

  return async function updateMethod(options: FaunaRoleOptions = {}) {
    return execute(
      [
        {
          name: `Update role [${roleName}]`,
          task() {
            return self.query(role.update.call(self, roleName, options));
          },
        },
      ],
      {
        domain: 'Biota.role.update',
      },
    );
  };
}
