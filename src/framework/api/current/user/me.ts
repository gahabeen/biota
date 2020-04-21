import { Biota } from '~/biota';
import { user } from '~/factory/api/user';
import { PassportUser } from '~/factory/constructors/identity';
import { execute } from '~/tools/tasks';
import { FrameworkCurrentUserApi } from '~/types/framework/framework.current.user';

export const currentUserMe: FrameworkCurrentUserApi['me'] = function (this: Biota) {
  const self = this;
  return execute(
    [
      {
        name: `Get current user`,
        task() {
          return self.query(user(self.context)(PassportUser()).get());
        },
      },
    ],
    {
      domain: 'Biota.current.user.me',
    },
  );
};
