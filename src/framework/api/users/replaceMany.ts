import { FrameworkUsersApi } from 'types/framework/framework.users';
import { users } from '~/factory/api/users';
import { execute } from '~/tools/tasks';

export const replaceMany: FrameworkUsersApi['replaceMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Replace many users`,
        task() {
          return self.query(users(self.context).replaceMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.users.replaceMany',
    },
  );
};
