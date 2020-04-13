import { FaunaRolePrivilege } from '~/../types/fauna';
import { Biota } from '~/biota';
import { role } from '~/factory/api/classes/role';
import { execute } from '~/tasks';

export function privilegeRepsert(this: Biota, roleName: string) {
  const self = this;

  return async function privilegeRepsertMethod(privilege: FaunaRolePrivilege = {}) {
    return execute(
      [
        {
          name: `Repsert role privilege for [${roleName}]`,
          task() {
            return self.query(role.privilege.repsert.call(self, roleName, privilege));
          },
        },
      ],
      {
        domain: 'Biota.role.privilege.repsert',
      },
    );
  };
}
