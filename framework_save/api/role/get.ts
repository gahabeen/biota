import { Biota } from '~/biota';
import { FaunaCollectionOptions, FaunaId } from '~/../types/fauna';
import { role } from '~/factory/api/classes/role';
import { execute } from '~/tasks';

export function get(this: Biota, roleName: string) {
  const self = this;

  return async function getMethod() {
    return execute(
      [
        {
          name: `Get [${roleName}]`,
          task() {
            return self.query(role.get.call(self, roleName));
          },
        },
      ],
      {
        domain: 'Biota.role.get',
      },
    );
  };
}