import { FaunaRolePrivilege } from '~/../types/fauna';
import { DB } from '~/db';
import { role } from '~/factory/api/classes/role';
import { execute } from '~/tasks';

export function privilegeUpsert(this: DB, roleName: string) {
  const self = this;

  return async function privilegeUpsertMethod(privilege: FaunaRolePrivilege = {}) {
    return execute(
      [
        {
          name: `Upsert role privilege for [${roleName}]`,
          task() {
            return self.query(role.privilege.upsert.call(self, roleName, privilege));
          },
        },
      ],
      {
        domain: 'DB.role.privilege.upsert',
      },
    );
  };
}
