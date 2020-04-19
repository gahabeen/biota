import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';

export const registerWithAuthAccount: FactoryUser<FrameworkUserApi['registerWithAuthAccount']> = function (id = null) {
  const self = this;

  return async (account) => {
    return execute(
      [
        {
          name: `Register with Auth Account ${account.provider}`,
          task() {
            return self.query(user(self.context)().registerWithAuthAccount(account));
          },
        },
      ],
      {
        domain: 'Biota.user.registerWithAuthAccount',
      },
    );
  };
};
