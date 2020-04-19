import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';

export const authEmailSet: FactoryUser<FrameworkUserApi['auth']['email']['set']> = function (id = null) {
  const self = this;

  return async (email) => {
    return execute(
      [
        {
          name: `(Auth) Set email of user [${id}]`,
          task() {
            return self.query(user(self.context)(id).auth.email.set(email));
          },
        },
      ],
      {
        domain: 'Biota.user.auth.email.set',
      },
    );
  };
};
