import { FrameworkUsersApi } from '~/types/framework/framework.users';
import { users } from '~/factory/api/users';
import { execute } from '~/tools/tasks';

export const restoreMany: FrameworkUsersApi['restoreMany'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Restore many users`,
        task() {
          return self.query(users(self.context).restoreMany(nameList));
        },
      },
    ],
    {
      domain: 'Biota.users.restoreMany',
    },
  );
};
