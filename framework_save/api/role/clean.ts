import { Biota } from '~/biota';
import { role } from '~/factory/api/classes/role';
import { execute } from '~/tasks';

export function drop(this: Biota, roleName: string) {
  const self = this;

  return async function dropMethod() {
    return execute(
      [
        {
          name: `Clean everything in (${roleName})`,
          task() {
            return self.query(role.drop.call(self, roleName));
          },
        },
      ],
      {
        domain: 'Biota.role.drop',
      },
    );
  };
}
