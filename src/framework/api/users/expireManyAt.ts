import { FrameworkUsersApi } from '~/types/framework/framework.users';
import { users } from '~/factory/api/users';
import { execute } from '~/tools/tasks';

export const expireManyAt: FrameworkUsersApi['expireManyAt'] = async function (nameList, at) {
  const self = this;

  return execute(
    [
      {
        name: `Expire many users at ${at}`,
        task() {
          return self.query(users(self.context).expireManyAt(nameList, at));
        },
      },
    ],
    {
      domain: 'Biota.users.expireManyAt',
    },
  );
};
