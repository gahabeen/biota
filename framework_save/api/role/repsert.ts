import { FaunaRoleOptions } from '~/../types/fauna';
import { Biota } from '~/biota';
import { role } from '~/factory/api/role';
import { execute } from '~/tools/tasks';

export function repsert(this: Biota, roleName: string) {
  const self = this;

  return async function repsertMethod(options: FaunaRoleOptions = {}) {
    return execute(
      [
        {
          name: `Replace/Insert [${roleName}]`,
          task() {
            return self.query(role.repsert.call(self, roleName, options));
          },
        },
      ],
      {
        domain: 'Biota.role.repsert',
      },
    );
  };
}
