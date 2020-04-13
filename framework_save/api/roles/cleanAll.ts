import { Biota } from '~/biota';
import { role } from '~/factory/api/classes/role';
import { execute } from '~/tasks';

export function cleanAll(this: Biota) {
  const self = this;
  return execute(
    [
      {
        name: `Clean all roles`,
        task() {
          return self.query(role.cleanAll.call(self));
        },
      },
    ],
    {
      domain: 'Biota.roles.cleanAll',
    },
  );
}
