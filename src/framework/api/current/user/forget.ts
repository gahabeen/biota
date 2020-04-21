import { ReferenceId } from '~/factory/api/constructors';
import { user } from '~/factory/api/user';
import { Identity } from '~/factory/constructors/identity';
import { execute } from '~/tools/tasks';
import { FrameworkUserApi } from '~/types/framework/framework.user';

export const currentUserForget: FrameworkUserApi['forget'] = function () {
  const self = this;

  return execute(
    [
      {
        name: `Forget current user`,
        task() {
          return self.query(user(self.context)(ReferenceId(Identity())).forget());
        },
      },
    ],
    {
      domain: 'Biota.current.user.forget',
    },
  );
};
