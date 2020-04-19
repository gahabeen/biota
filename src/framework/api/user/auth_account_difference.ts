import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';

export const authAccountDifference: FactoryUser<FrameworkUserApi['auth']['account']['difference']> = function (id = null) {
  const self = this;

  return async (provider, accountId) => {
    return execute(
      [
        {
          name: `(Auth) Difference accounts of user [${id}]`,
          task() {
            return self.query(user(self.context)(id).auth.account.difference(provider, accountId));
          },
        },
      ],
      {
        domain: 'Biota.user.auth.account.difference',
      },
    );
  };
};
