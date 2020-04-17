import { FrameworkUsersApi } from 'types/framework/framework.users';
import { users } from '~/factory/api/users';
import { execute } from '~/tools/tasks';

export const insertMany: FrameworkUsersApi['insertMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Insert many users`,
        task() {
          return self.query(users(self.context).insertMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.users.insertMany',
    },
  );
};
