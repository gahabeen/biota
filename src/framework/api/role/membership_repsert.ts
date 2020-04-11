import { FaunaRoleMembership } from '~/../types/fauna';
import { DB } from '~/db';
import { role } from '~/factory/api/classes/role';
import { execute } from '~/tasks';

export function membershipRepsert(this: DB, roleName: string) {
  const self = this;

  return async function membershipRepsertMethod(membership: FaunaRoleMembership = {}) {
    return execute(
      [
        {
          name: `Repsert role membership [${roleName}] on [${membership.resource}]`,
          task() {
            return self.query(role.membership.repsert.call(self, roleName, membership));
          },
        },
      ],
      {
        domain: 'DB.role.membership.repsert',
      },
    );
  };
}
