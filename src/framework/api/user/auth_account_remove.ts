import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';

export const authAccountRemove: FactoryUser<FrameworkUserApi['auth']['account']['remove']> = function (id = null) {
  const self = this;

  return async (provider, accountId) => {
    return execute(
      [
        {
          name: `(Auth) Remove account [${provider}/${accountId}] of user [${id}]`,
          task() {
            return self.query(user(self.context)(id).auth.account.remove(provider, accountId));
          },
        },
      ],
      {
        domain: 'Biota.user.auth.account.remove',
      },
    );
  };
};
