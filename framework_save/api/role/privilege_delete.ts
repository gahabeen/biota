import { Biota } from '~/biota';
import { FaunaCollectionOptions, FaunaId, FaunaRoleMembership, FaunaRef } from '~/../types/fauna';
import { role } from '~/factory/api/classes/role';
import { execute } from '~/tasks';

export function privilegeDelete(this: Biota, roleName: string) {
  const self = this;

  return async function privilegeDeleteMethod(resource: FaunaRef) {
    return execute(
      [
        {
          name: `Delete role privilege [${roleName}] on [${resource}]`,
          task() {
            return self.query(role.privilege.delete.call(self, roleName, resource));
          },
        },
      ],
      {
        domain: 'Biota.role.privilege.delete',
      },
    );
  };
}
