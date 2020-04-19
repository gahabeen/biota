import { Biota } from '~/biota';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';
import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkCurrentUserApi } from '~/types/framework/framework.current.user';

export const currentUserLogin: FactoryUser<FrameworkCurrentUserApi['login']> = function () {
  const self = this;

  return async (email, password) => {
    return execute(
      [
        {
          name: `Login`,
          task() {
            return self.query(user(self.context)().login(email, password)).then(({ secret }) => {
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
        domain: 'Biota.current.user.login',
      },
    );
  };
};
