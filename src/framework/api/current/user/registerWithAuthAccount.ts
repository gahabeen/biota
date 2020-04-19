import { Biota } from '~/biota';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';
import { FrameworkUserApi } from '~/types/framework/framework.user';

export const currentUserRegisterWithAuthAccount: FrameworkUserApi['registerWithAuthAccount'] = function (this: Biota, account) {
  const self = this;

  return execute(
    [
      {
        name: `Register with Auth Account ${account.provider}`,
        task() {
          return self.query(user(self.context)().registerWithAuthAccount(account)).then(({ secret }) => {
            if (secret) {
              return new Biota({ secret });
            } else {
              return self;
            }
          });
        },
      },
    ],
    {
      domain: 'Biota.current.user.registerWithAuthAccount',
    },
  );
};
