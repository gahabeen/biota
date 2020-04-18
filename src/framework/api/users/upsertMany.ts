import { FrameworkUsersApi } from '~/types/framework/framework.users';
import { users } from '~/factory/api/users';
import { execute } from '~/tools/tasks';

export const upsertMany: FrameworkUsersApi['upsertMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Upsert many users`,
        task() {
          return self.query(users(self.context).upsertMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.users.upsertMany',
    },
  );
};
