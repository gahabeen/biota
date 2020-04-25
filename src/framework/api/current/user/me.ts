import { Biota } from '~/biota';
import { ReferenceId } from '~/factory/api/constructors';
import { user } from '~/factory/api/user';
import { PassportUser } from '~/factory/constructors/identity';
import { execute } from '~/tools/tasks';
import { FrameworkCurrentUserApi } from '~/types/framework/framework.current.user';

export const currentUserMe: FrameworkCurrentUserApi['me'] = function (this: Biota) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const self = this;
  return execute(
    [
      {
        name: `Get current user`,
        task() {
          return self.query(user(self.context)(ReferenceId(PassportUser())).get());
        },
      },
    ],
    {
      domain: 'Biota.current.user.me',
    },
  );
};
