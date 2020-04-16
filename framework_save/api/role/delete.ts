import { Biota } from '~/biota';
import { FaunaCollectionOptions, FaunaId } from '~/../types/fauna';
import { role } from '~/factory/api/role';
import { execute } from '~/tools/tasks';

export function delete_(this: Biota, roleName: string) {
  const self = this;

  return async function deleteMethod() {
    return execute(
      [
        {
          name: `Delete (${id}) in (${roleName})`,
          task() {
            return self.query(role.delete.call(self, roleName));
          },
        },
      ],
      {
        domain: 'Biota.role.delete',
      },
    );
  };
}
