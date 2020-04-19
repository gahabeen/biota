import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';

export const authAccountDistinct: FactoryUser<FrameworkUserApi['auth']['account']['distinct']> = function (id = null) {
  const self = this;

  return async (account) => {
    return execute(
      [
        {
          name: `(Auth) Distinct accounts of user [${id}]`,
          task() {
            return self.query(user(self.context)(id).auth.account.distinct(account));
          },
        },
      ],
      {
        domain: 'Biota.user.auth.account.distinct',
      },
    );
  };
};
