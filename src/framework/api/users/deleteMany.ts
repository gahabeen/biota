import { FrameworkUsersApi } from '~/types/framework/framework.users';
import { users } from '~/factory/api/users';
import { execute } from '~/tools/tasks';

export const deleteMany: FrameworkUsersApi['deleteMany'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Delete many users`,
        task() {
          return self.query(users(self.context).deleteMany(nameList));
        },
      },
    ],
    {
      domain: 'Biota.users.deleteMany',
    },
  );
};
