import { Biota } from '~/biota';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';
import { FrameworkCurrentUserApi } from '~/types/framework/framework.current.user';

export const currentUserLogin: FrameworkCurrentUserApi['login'] = function (this: Biota, email, password, expireIn) {
  const self = this;
  return execute(
    [
      {
        name: `Login`,
        task() {
          return self.query(user(self.context)().login(email, password, expireIn)).then((res: any) => {
            const { secret } = (res.data as any) || {};
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
