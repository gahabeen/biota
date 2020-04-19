import { Biota } from '~/biota';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';
import { FrameworkUserApi } from '~/types/framework/framework.user';

export const currentUserLoginWithAuthAccount: FrameworkUserApi['loginWithAuthAccount'] = function (this: Biota, account) {
  const self = this;

  return execute(
    [
      {
        name: `Login with Auth Account ${account.provider}`,
        task() {
          return self.query(user(self.context)().loginWithAuthAccount(account)).then((res: any) => {
            const { secret } = (res.data as any) || {};
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
      domain: 'Biota.current.user.loginWithAuthAccount',
    },
  );
};
