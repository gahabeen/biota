import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';

export const login: FactoryUser<FrameworkUserApi['login']> = function (id = null) {
  const self = this;

  return async (email = null, password = null, expireIn = null) => {
    return execute(
      [
        {
          name: `Login for ${email}`,
          task() {
            return self.query(user(self.context)().login(email, password, expireIn));
          },
        },
      ],
      {
        domain: 'Biota.user.login',
      },
    );
  };
};
