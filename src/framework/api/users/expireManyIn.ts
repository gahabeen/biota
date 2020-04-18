import { FrameworkUsersApi } from '~/types/framework/framework.users';
import { users } from '~/factory/api/users';
import { execute } from '~/tools/tasks';

export const expireManyIn: FrameworkUsersApi['expireManyIn'] = async function (nameList, delay) {
  const self = this;

  return execute(
    [
      {
        name: `Expire many users in ${delay}ms`,
        task() {
          return self.query(users(self.context).expireManyIn(nameList, delay));
        },
      },
    ],
    {
      domain: 'Biota.users.expireManyIn',
    },
  );
};
