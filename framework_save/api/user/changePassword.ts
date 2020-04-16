import { Biota } from '~/biota';
import { user as userCALL } from '~/factory/api/call/user';
import { execute } from '~/tools/tasks';

export async function changePassword(this: Biota, newPassword: string) {
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
      domain: 'Biota.user.login',
    },
  );
}
