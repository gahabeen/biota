import { FrameworkUsersApi } from 'types/framework/framework.users';
import { users } from '~/factory/api/users';
import { execute } from '~/tools/tasks';

export const getByAuthEmail: FrameworkUsersApi['getByAuthEmail'] = async function (email = null) {
  const self = this;

  return execute(
    [
      {
        name: `Get by auth email [${email}]`,
        task() {
          return self.query(users(self.context).getByAuthEmail(email));
        },
      },
    ],
    {
      domain: 'Biota.users.getByAuthEmail',
    },
  );
};
