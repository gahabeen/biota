import { FrameworkUsersApi } from '~/types/framework/framework.users';
import { users } from '~/factory/api/users';
import { execute } from '~/tools/tasks';

export const getByAuthAccount: FrameworkUsersApi['getByAuthAccount'] = async function (providerOrAccount = null, accountId = null) {
  const self = this;

  return execute(
    [
      {
        name: `Get by auth account [${providerOrAccount}/${accountId}]`,
        task() {
          return self.query(users(self.context).getByAuthAccount(providerOrAccount, accountId));
        },
      },
    ],
    {
      domain: 'Biota.users.getByAuthAccount',
    },
  );
};
