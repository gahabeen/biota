import { Biota } from '~/biota';
import { execute } from '~/tasks';
import { query as q } from 'faunadb';
import { user as userCALL } from '~/factory/api/call/user';

export async function logout(this: Biota, everywhere: boolean = false) {
  const self = this;
  return execute(
    [
      {
        name: `Logout`,
        task() {
          return self.query(userCALL.logout.call(self, everywhere));
        },
      },
    ],
    {
      domain: 'Biota.user.logout',
    },
  );
}
