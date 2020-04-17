import { FrameworkUsersApi } from 'types/framework/framework.users';
import { users } from '~/factory/api/users';
import { execute } from '~/tools/tasks';

export const dropMany: FrameworkUsersApi['dropMany'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Drop many users`,
        task() {
          return self.query(users(self.context).dropMany(nameList));
        },
      },
    ],
    {
      domain: 'Biota.users.dropMany',
    },
  );
};
