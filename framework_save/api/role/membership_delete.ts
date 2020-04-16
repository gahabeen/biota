import { Biota } from '~/biota';
import { FaunaCollectionOptions, FaunaId, FaunaRoleMembership, FaunaRef } from '~/../types/fauna';
import { role } from '~/factory/api/role';
import { execute } from '~/tools/tasks';

export function membershipDelete(this: Biota, roleName: string) {
  const self = this;

  return async function membershipDeleteMethod(resource: FaunaRef) {
    return execute(
      [
        {
          name: `Delete role membership [${roleName}] on [${resource}]`,
          task() {
            return self.query(role.membership.delete.call(self, roleName, resource));
          },
        },
      ],
      {
        domain: 'Biota.role.membership.delete',
      },
    );
  };
}
