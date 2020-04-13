import { Biota } from '~/biota';
import { FaunaCollectionOptions, FaunaId } from '~/../types/fauna';
import { role } from '~/factory/api/classes/role';
import { execute } from '~/tasks';

export function forget(this: Biota, roleName: string) {
  const self = this;

  return async function forgetMethod(id: FaunaId) {
    return execute(
      [
        {
          name: `Forget (${id}) in (${roleName})`,
          task() {
            return self.query(role.forget.call(self, roleName));
          },
        },
      ],
      {
        domain: 'Biota.role.forget',
      },
    );
  };
}
