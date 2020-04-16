import { Biota } from '~/biota';
import { role } from '~/factory/api/role';
import { execute } from '~/tools/tasks';

export function dropAll(this: Biota) {
  const self = this;
  return execute(
    [
      {
        name: `Clean all roles`,
        task() {
          return self.query(role.dropAll.call(self));
        },
      },
    ],
    {
      domain: 'Biota.roles.dropAll',
    },
  );
}
