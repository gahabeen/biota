import { FaunaRoleMembership } from '~/../types/fauna';
import { Biota } from '~/biota';
import { role } from '~/factory/api/role';
import { execute } from '~/tools/tasks';

export function membershipRepsert(this: Biota, roleName: string) {
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
        domain: 'Biota.role.membership.repsert',
      },
    );
  };
}
