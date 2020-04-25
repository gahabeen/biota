import { Biota } from '~/biota';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';
import { FrameworkUserApi } from '~/types/framework/framework.user';

export const currentUserRegister: FrameworkUserApi['register'] = function (this: Biota, email, password, data = {}, expireIn = null) {
  const self = this;

  return execute(
    [
      {
        name: `Register ${email}`,
        task() {
          return self.query(user(self.context)().register(email, password, data, expireIn)).then((res: any) => {
            const { secret } = (res.data as any) || {};
            if (secret) {
              return new Biota({ secret });
            } else {
              return res;
            }
          });
        },
      },
    ],
    {
      domain: 'Biota.current.user.register',
    },
  );
};
