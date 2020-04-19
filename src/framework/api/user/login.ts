import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';

export const login: FactoryUser<FrameworkUserApi['login']> = function (id = null) {
  const self = this;

  return async (email, password) => {
    return execute(
      [
        {
          name: `Login for ${email}`,
          task() {
            return self.query(user(self.context)().login(email, password));
          },
        },
      ],
      {
        domain: 'Biota.user.login',
      },
    );
  };
};
