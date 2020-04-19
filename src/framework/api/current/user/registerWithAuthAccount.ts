import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';
import { Biota } from '~/biota';

export const currentUserRegisterWithAuthAccount: FactoryUser<FrameworkUserApi['registerWithAuthAccount']> = function (id = null) {
  const self = this;

  return async (account) => {
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
};
