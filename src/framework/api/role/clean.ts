import { DB } from '~/db';
import { role } from '~/factory/api/classes/role';
import { execute } from '~/tasks';

export function clean(this: DB, roleName: string) {
  const self = this;

  return async function cleanMethod() {
    return execute(
      [
        {
          name: `Clean everything in (${roleName})`,
          task() {
            return self.query(role.clean.call(self, roleName));
          },
        },
      ],
      {
        domain: 'DB.role.clean',
      },
    );
  };
}
