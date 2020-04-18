import { FrameworkUsersApi } from '~/types/framework/framework.users';
import { users } from '~/factory/api/users';
import { execute } from '~/tools/tasks';

export const updateMany: FrameworkUsersApi['updateMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Update many users`,
        task() {
          return self.query(users(self.context).updateMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.users.updateMany',
    },
  );
};
