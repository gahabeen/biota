import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';

export const authEmailRemove: FactoryUser<FrameworkUserApi['auth']['email']['remove']> = function (id = null) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `(Auth) Remove email of user [${id}]`,
          task() {
            return self.query(user(self.context)(id).auth.email.remove());
          },
        },
      ],
      {
        domain: 'Biota.user.auth.email.remove',
      },
    );
  };
};
