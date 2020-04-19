import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { Biota } from '~/biota';

export const currentUserPasswordChangePassword: FrameworkUserApi['changePassword'] = function (this: Biota, currentPassword, password) {
  const self = this;
  return execute(
    [
      {
        name: `Change password`,
        task() {
          return self.query(user(self.context)().changePassword(currentPassword, password));
        },
      },
    ],
    {
      domain: 'Biota.current.user.changePassword',
    },
  );
};
