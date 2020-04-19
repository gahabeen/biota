import { Biota } from '~/biota';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';
import { FrameworkCurrentUserApi } from '~/types/framework/framework.current.user';

export const currentUserLogin: FrameworkCurrentUserApi['login'] = function (this: Biota, email, password) {
  const self = this;
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
