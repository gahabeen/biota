import { FrameworkUsersApi } from '~/types/framework/framework.users';
import { users } from '~/factory/api/users';
import { execute } from '~/tools/tasks';

export const forgetMany: FrameworkUsersApi['forgetMany'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Forget many users`,
        task() {
          return self.query(users(self.context).forgetMany(nameList));
        },
      },
    ],
    {
      domain: 'Biota.users.forgetMany',
    },
  );
};
