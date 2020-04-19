import { Biota } from '~/biota';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';
import { FrameworkUserApi } from '~/types/framework/framework.user';

export const currentUserLogout: FrameworkUserApi['logout'] = function (this: Biota, everywhere) {
  const self = this;
  return execute(
    [
      {
        name: `Logout ${everywhere ? ` from everywhere` : ''}`,
        task() {
          return self.query(user(self.context)().logout(everywhere));
        },
      },
    ],
    {
      domain: 'Biota.current.user.logout',
    },
  );
};
