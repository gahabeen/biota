import { DB } from '~/db';
import { user as userCALL } from '~/factory/api/call/user';
import { execute } from '~/tasks';

export async function changePassword(this: DB, newPassword: string) {
  const self = this;
  return execute(
    [
      {
        name: `Change password for current user`,
        task() {
          return self.query(userCALL.changePassword.call(self, newPassword));
        },
      },
    ],
    {
      domain: 'DB.user.login',
    },
  );
}
