import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';

export const authAccountSet: FactoryUser<FrameworkUserApi['auth']['account']['set']> = function (id = null) {
  const self = this;

  return async (account) => {
    return execute(
      [
        {
          name: `(Auth) Set account of user [${id}]`,
          task() {
            return self.query(user(self.context)(id).auth.account.set(account));
          },
        },
      ],
      {
        domain: 'Biota.user.auth.account.set',
      },
    );
  };
};
