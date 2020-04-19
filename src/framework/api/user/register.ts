import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';

export const register: FactoryUser<FrameworkUserApi['register']> = function (id = null) {
  const self = this;

  return async (email, password, data) => {
    return execute(
      [
        {
          name: `Register ${email}`,
          task() {
            return self.query(user(self.context)().register(email, password, data));
          },
        },
      ],
      {
        domain: 'Biota.user.register',
      },
    );
  };
};
