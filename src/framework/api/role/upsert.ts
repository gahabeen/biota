import { DB } from '~/db';
import { FaunaCollectionOptions, FaunaId, FaunaRoleOptions } from '~/../types/fauna';
import { role } from '~/factory/api/classes/role';
import { execute } from '~/tasks';

export function upsert(this: DB, roleName: string) {
  const self = this;

  return async function upsertMethod(options: FaunaRoleOptions = {}) {
    return execute(
      [
        {
          name: `Update/Insert [${roleName}]`,
          task() {
            return self.query(role.upsert.call(self, roleName, options));
          },
        },
      ],
      {
        domain: 'DB.collection.upsert',
      },
    );
  };
}
