import { FrameworkUsersApi } from 'types/framework/framework.users';
import { users } from '~/factory/api/users';
import { execute } from '~/tools/tasks';

export const findAll: FrameworkUsersApi['findAll'] = async function (pagination = {}) {
  const self = this;

  return execute(
    [
      {
        name: `Find all users`,
        task() {
          return self.query(users(self.context).findAll(pagination));
        },
      },
    ],
    {
      domain: 'Biota.users.findAll',
    },
  );
};
