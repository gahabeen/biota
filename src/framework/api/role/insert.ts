import { FaunaId, FaunaDocumentOptions, FaunaRoleOptions } from '~/../types/fauna';
import { Biota } from '~/biota';
import { role } from '~/factory/api/classes/role';
import { execute } from '~/tasks';

export function insert(this: Biota, roleName: string) {
  const self = this;

  return async function insertMethod(options: FaunaRoleOptions = {}) {
    return execute(
      [
        {
          name: `Insert role [${roleName}]`,
          task() {
            return self.query(role.insert.call(self, roleName, options));
          },
        },
      ],
      {
        domain: 'Biota.role.insert',
      },
    );
  };
}
