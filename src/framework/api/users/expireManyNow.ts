import { FrameworkUsersApi } from '~/types/framework/framework.users';
import { users } from '~/factory/api/users';
import { execute } from '~/tools/tasks';

export const expireManyNow: FrameworkUsersApi['expireManyNow'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Expire many users now`,
        task() {
          return self.query(users(self.context).expireManyNow(nameList));
        },
      },
    ],
    {
      domain: 'Biota.users.expireManyNow',
    },
  );
};
